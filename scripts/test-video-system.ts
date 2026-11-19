import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import http from 'node:http';
import express from 'express';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { createVideoRouter } from '../server/api/videoRouter.js';
import {
  CloudflareConfig,
  verifyCloudflareWebhookSignature,
} from '../server/api/cloudflareStream.js';
import { db, pool } from '../src/db/index.ts';
import { videos } from '../src/db/schema.ts';
import { AuthRequest } from '../src/middleware/auth.ts';

dotenv.config();

const TEST_WEBHOOK_SECRET = 'test_webhook_secret_al_noor_2026';
const TEST_CF_CONFIG: CloudflareConfig = {
  accountId: 'test-cf-account-001',
  apiToken: 'test-cf-token-secret',
  webhookSecret: TEST_WEBHOOK_SECRET,
  customerSubdomain: 'customer-testalnoor.cloudflarestream.com',
};

const createdVideoIds: number[] = [];

function signWebhook(rawBody: string, secret: string, tsSeconds = Math.floor(Date.now() / 1000)) {
  const sig = crypto.createHmac('sha256', secret).update(`${tsSeconds}.${rawBody}`, 'utf8').digest('hex');
  return `time=${tsSeconds},sig1=${sig}`;
}

async function runTests() {
  let cfMockState: 'pendingupload' | 'inprogress' | 'ready' | 'error' = 'inprogress';
  let cfMockCounter = 0;

  const mockFetch: typeof fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = (init?.method || 'GET').toUpperCase();

    // Create Direct TUS Upload URL
    if (url.includes('/stream?direct_user=true') && method === 'POST') {
      cfMockCounter += 1;
      const uid = `cf-test-uid-${Date.now()}-${cfMockCounter}`;
      return new Response(null, {
        status: 201,
        headers: {
          location: `https://upload.videodelivery.net/tus/${uid}?tusv2=true`,
          'stream-media-id': uid,
        },
      });
    }

    // Get Video Details
    if (url.includes('/stream/cf-test-uid-') && method === 'GET') {
      const uid = url.split('/stream/')[1];
      return new Response(
        JSON.stringify({
          success: true,
          result: {
            uid,
            readyToStream: cfMockState === 'ready',
            duration: cfMockState === 'ready' ? 324 : 0,
            playback:
              cfMockState === 'ready'
                ? { hls: `https://customer-testalnoor.cloudflarestream.com/${uid}/manifest/video.m3u8` }
                : {},
            thumbnail:
              cfMockState === 'ready'
                ? `https://customer-testalnoor.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg`
                : null,
            status: {
              state: cfMockState,
              pctComplete: cfMockState === 'ready' ? '100' : cfMockState === 'inprogress' ? '45' : '0',
              errorReasonCode: cfMockState === 'error' ? 'ERR_CORRUPT_CODEC' : undefined,
              errorReasonText: cfMockState === 'error' ? 'Unsupported corrupt stream codec' : undefined,
            },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete Video
    if (url.includes('/stream/cf-test-uid-') && method === 'DELETE') {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    throw new Error(`Unexpected fetch call in test: ${method} ${url}`);
  };

  // Auth middleware simulator supporting unauthenticated (401), student (403), and admin (200)
  const testAuthMiddleware = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    const auth = req.headers.authorization;
    if (auth === 'Bearer test-admin-token') {
      req.user = { uid: 'test-admin-uid', email: 'mekoogk@gmail.com', admin: true } as any;
      return next();
    }
    if (auth === 'Bearer test-student-token') {
      req.user = { uid: 'test-student-uid', email: 'student@example.com', admin: false } as any;
      return next();
    }
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
  };

  const testAdminMiddleware = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (req.user?.email === 'mekoogk@gmail.com' || req.user?.admin) {
      return next();
    }
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } });
  };

  let activeConfig: CloudflareConfig | null = TEST_CF_CONFIG;

  const app = express();
  app.use(
    express.json({
      limit: '10mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.use(
    '/api/v1',
    createVideoRouter({
      getCloudflareConfigFn: () => activeConfig,
      fetchImpl: mockFetch,
      authMiddleware: testAuthMiddleware as any,
      adminMiddleware: testAdminMiddleware as any,
    })
  );

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${addr.port}/api/v1`;

  try {
    console.log('1. Testing unauthorized access guards (401 & 403)...');
    const unauthRes = await fetch(`${baseUrl}/admin/videos`);
    assert.equal(unauthRes.status, 401);

    const nonAdminRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-student-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'اختبار',
        titleEn: 'Test',
        category: 'islamic_lectures',
        fileName: 'lecture.mp4',
        fileSizeBytes: 1024 * 1024,
      }),
    });
    assert.equal(nonAdminRes.status, 403);

    console.log('2. Testing missing Cloudflare config fails honestly with 503 (no mock uploads)...');
    activeConfig = null;
    const noCfgRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'محاضرة التوحيد',
        titleEn: 'Tawheed Lecture',
        category: 'islamic_lectures',
        fileName: 'tawheed.mp4',
        mimeType: 'video/mp4',
        fileSizeBytes: 25_000_000,
      }),
    });
    assert.equal(noCfgRes.status, 503);
    const noCfgJson: any = await noCfgRes.json();
    assert.equal(noCfgJson.error.code, 'CLOUDFLARE_CONFIG_MISSING');
    activeConfig = TEST_CF_CONFIG;

    console.log('3. Testing invalid file format and oversized file rejection (Arabic errors)...');
    const badExtRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'ملف غير صالح',
        titleEn: 'Invalid Format',
        category: 'islamic_lectures',
        fileName: 'malware.exe',
        mimeType: 'application/x-msdownload',
        fileSizeBytes: 1024,
      }),
    });
    assert.equal(badExtRes.status, 400);

    const oversizeRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'ملف ضخم جداً',
        titleEn: 'Oversize Video',
        category: 'islamic_lectures',
        fileName: 'huge.mp4',
        mimeType: 'video/mp4',
        fileSizeBytes: 9 * 1024 * 1024 * 1024,
      }),
    });
    assert.equal(oversizeRes.status, 400);

    console.log('4. Testing small upload & large multi-GB (4.2 GB) Direct Creator TUS URL init...');
    const smallFp = `fp-small-${Date.now()}`;
    const smallInitRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'تلاوة سورة الفاتحة',
        titleEn: 'Surah Al-Fatihah Recitation',
        description: 'تلاوة برواية حفص',
        category: 'quran_recitations',
        fileName: 'fatihah.mp4',
        mimeType: 'video/mp4',
        fileSizeBytes: 12_500_000,
        fileFingerprint: smallFp,
      }),
    });
    assert.equal(smallInitRes.status, 200);
    const smallJson: any = await smallInitRes.json();
    const smallVideo = smallJson.data.video;
    createdVideoIds.push(smallVideo.id);
    assert.ok(smallJson.data.uploadUrl.startsWith('https://upload.videodelivery.net/tus/'));
    assert.equal(smallVideo.uploadStatus, 'pending_upload');
    assert.equal(smallVideo.publicationStatus, 'draft');

    // Large 4.2GB file (tests PostgreSQL bigint support)
    const largeFp = `fp-large-${Date.now()}`;
    const largeInitRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'دورة التجويد الكاملة',
        titleEn: 'Complete Tajweed Course',
        category: 'educational_courses',
        fileName: 'tajweed_full.mkv',
        mimeType: 'video/x-matroska',
        fileSizeBytes: 4_200_000_000,
        fileFingerprint: largeFp,
      }),
    });
    assert.equal(largeInitRes.status, 200);
    const largeJson: any = await largeInitRes.json();
    createdVideoIds.push(largeJson.data.video.id);
    assert.equal(largeJson.data.video.fileSizeBytes, 4_200_000_000);

    console.log('5. Testing duplicate upload prevention (409 DUPLICATE_UPLOAD)...');
    const dupRes = await fetch(`${baseUrl}/videos/upload-url`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titleAr: 'تلاوة مكررة',
        titleEn: 'Duplicate Recitation',
        category: 'quran_recitations',
        fileName: 'fatihah.mp4',
        mimeType: 'video/mp4',
        fileSizeBytes: 12_500_000,
        fileFingerprint: smallFp,
      }),
    });
    assert.equal(dupRes.status, 409);

    console.log('6. Testing interrupted upload & blocking premature publish...');
    const interruptRes = await fetch(`${baseUrl}/videos/${smallVideo.id}/upload-state`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: 'error', errorMessage: 'Connection dropped mid-upload' }),
    });
    assert.equal(interruptRes.status, 200);
    const interruptedVideo: any = (await interruptRes.json()).data;
    assert.equal(interruptedVideo.uploadStatus, 'error');

    // Resume / complete upload moves to 'processing' (NOT 'ready')
    const uploadedRes = await fetch(`${baseUrl}/videos/${smallVideo.id}/upload-state`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: 'uploaded' }),
    });
    assert.equal(uploadedRes.status, 200);
    const processingVideo: any = (await uploadedRes.json()).data;
    assert.equal(processingVideo.uploadStatus, 'processing');

    // Attempt to publish before ready -> MUST fail with 409
    const prematurePubRes = await fetch(`${baseUrl}/admin/videos/${smallVideo.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicationStatus: 'published' }),
    });
    assert.equal(prematurePubRes.status, 409);

    // Public catalog MUST NOT expose draft/processing video
    const publicEmptyRes = await fetch(`${baseUrl}/videos/${smallVideo.publicId}`);
    assert.equal(publicEmptyRes.status, 404);

    console.log('7. Testing expired upload URL handling & failed processing state...');
    await db
      .update(videos)
      .set({ uploadUrlExpiresAt: new Date(Date.now() - 120_000), uploadStatus: 'pending_upload' })
      .where(eq(videos.id, largeJson.data.video.id));
    cfMockState = 'pendingupload';
    const expiredSyncRes = await fetch(`${baseUrl}/videos/${largeJson.data.video.id}/sync-status`, {
      method: 'POST',
      headers: { Authorization: 'Bearer test-admin-token' },
    });
    const expiredSynced: any = (await expiredSyncRes.json()).data;
    assert.equal(expiredSynced.uploadStatus, 'error');

    // Failed processing via sync
    cfMockState = 'error';
    const failSyncRes = await fetch(`${baseUrl}/videos/${smallVideo.id}/sync-status`, {
      method: 'POST',
      headers: { Authorization: 'Bearer test-admin-token' },
    });
    const failedSynced: any = (await failSyncRes.json()).data;
    assert.equal(failedSynced.uploadStatus, 'error');

    console.log('8. Testing Cloudflare Webhook HMAC-SHA256 verification (valid & invalid)...');
    const webhookPayload = JSON.stringify({
      uid: smallVideo.streamVideoId,
      readyToStream: true,
      duration: 245,
      playback: {
        hls: `https://customer-testalnoor.cloudflarestream.com/${smallVideo.streamVideoId}/manifest/video.m3u8`,
      },
      thumbnail: `https://customer-testalnoor.cloudflarestream.com/${smallVideo.streamVideoId}/thumbnails/thumbnail.jpg`,
      status: { state: 'ready', pctComplete: '100' },
    });

    // Tampered signature must fail 401
    const badWebhookRes = await fetch(`${baseUrl}/webhooks/cloudflare-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Webhook-Signature': 'time=1700000000,sig1=deadbeef',
      },
      body: webhookPayload,
    });
    assert.equal(badWebhookRes.status, 401);

    // Valid HMAC signature must succeed 200 and transition video to ready
    const validSig = signWebhook(webhookPayload, TEST_WEBHOOK_SECRET);
    const goodWebhookRes = await fetch(`${baseUrl}/webhooks/cloudflare-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Webhook-Signature': validSig,
      },
      body: webhookPayload,
    });
    assert.equal(goodWebhookRes.status, 200);
    const webhookJson: any = await goodWebhookRes.json();
    assert.equal(webhookJson.data.video.uploadStatus, 'ready');
    assert.equal(webhookJson.data.video.processingProgress, 100);
    assert.ok(webhookJson.data.video.playbackUrl.endsWith('.m3u8'));

    // Direct helper check on expired timestamp
    const expiredSigCheck = verifyCloudflareWebhookSignature(
      webhookPayload,
      signWebhook(webhookPayload, TEST_WEBHOOK_SECRET, Math.floor(Date.now() / 1000) - 3600),
      TEST_WEBHOOK_SECRET
    );
    assert.equal(expiredSigCheck.verified, false);

    console.log('9. Testing custom thumbnail validation (magic bytes)...');
    const spoofedThumbRes = await fetch(`${baseUrl}/videos/${smallVideo.id}/thumbnail`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageDataUrl: `data:image/png;base64,${Buffer.from('NOT_A_PNG_FILE_PAYLOAD').toString('base64')}`,
      }),
    });
    assert.equal(spoofedThumbRes.status, 400);

    // Valid 1x1 PNG magic header
    const validPngBuf = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    ]);
    const goodThumbRes = await fetch(`${baseUrl}/videos/${smallVideo.id}/thumbnail`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageDataUrl: `data:image/png;base64,${validPngBuf.toString('base64')}`,
      }),
    });
    assert.equal(goodThumbRes.status, 200);

    console.log('10. Testing publish ready video & public library search/filter/views...');
    const pubRes = await fetch(`${baseUrl}/admin/videos/${smallVideo.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer test-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicationStatus: 'published' }),
    });
    assert.equal(pubRes.status, 200);

    const publicListRes = await fetch(`${baseUrl}/videos?category=quran_recitations&q=${encodeURIComponent('الفاتحة')}`);
    assert.equal(publicListRes.status, 200);
    const publicListJson: any = await publicListRes.json();
    assert.ok(publicListJson.data.items.some((v: any) => v.id === smallVideo.id));

    const viewRes = await fetch(`${baseUrl}/videos/${smallVideo.publicId}/view`, { method: 'POST' });
    assert.equal(viewRes.status, 200);
    assert.equal((await viewRes.json()).data.viewsCount, 1);

    console.log('11. Testing concurrent uploads (5 simultaneous upload-url requests)...');
    const concurrentReqs = Array.from({ length: 5 }, (_, idx) =>
      fetch(`${baseUrl}/videos/upload-url`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-admin-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleAr: `فيديو متزامن ${idx + 1}`,
          titleEn: `Concurrent Video ${idx + 1}`,
          category: 'charity_activities',
          fileName: `concurrent_${idx}.mp4`,
          mimeType: 'video/mp4',
          fileSizeBytes: 5_000_000 + idx,
          fileFingerprint: `fp-concurrent-${Date.now()}-${idx}`,
        }),
      }).then(async (r) => {
        const j: any = await r.json();
        if (j?.data?.video?.id) createdVideoIds.push(j.data.video.id);
        return r.status;
      })
    );
    const concurrentStatuses = await Promise.all(concurrentReqs);
    assert.deepEqual(concurrentStatuses, [200, 200, 200, 200, 200]);

    console.log('12. Testing delete video cleanup via API...');
    const delRes = await fetch(`${baseUrl}/admin/videos/${smallVideo.id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer test-admin-token' },
    });
    assert.equal(delRes.status, 200);

    console.log('\nALL 12 VIDEO SYSTEM INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } finally {
    // Cleanup any remaining test records in PostgreSQL
    for (const vid of createdVideoIds) {
      await db.delete(videos).where(eq(videos.id, vid)).catch(() => {});
    }
    server.close();
    await pool.end();
  }
}

runTests().catch((err) => {
  console.error('Video System Test Failed:', err);
  process.exit(1);
});
