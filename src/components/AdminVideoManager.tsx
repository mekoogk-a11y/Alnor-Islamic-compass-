import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as tus from 'tus-js-client';
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  Eye,
  Film,
  Image as ImageIcon,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  WifiOff,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { auth } from '../services/firebase';
import { VideoCategory, VideoRecord } from '../types';
import {
  compressThumbnailToDataUrl,
  computeFileFingerprint,
  formatBytes,
  formatDuration,
  validateVideoFileClient,
  VIDEO_CATEGORY_LIST,
  VIDEO_CATEGORY_MAP,
} from '../utils/videoCategories';
import { HlsVideoPlayer } from './HlsVideoPlayer';

interface UploadTaskState {
  videoId: number;
  publicId: string;
  fileName: string;
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
  speedBytesPerSec: number;
  status: 'uploading' | 'paused' | 'offline_waiting' | 'completed' | 'error';
  errorMessage?: string;
}

export const AdminVideoManager: React.FC = () => {
  const { lang, isRtl } = useLanguage();
  const { showToast } = useToast();
  const isAr = lang === 'ar';

  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudflareConfigured, setCloudflareConfigured] = useState<boolean>(true);
  const [maxFileSizeBytes, setMaxFileSizeBytes] = useState<number>(5 * 1024 * 1024 * 1024);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // New Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('islamic_lectures');
  const [customThumbDataUrl, setCustomThumbDataUrl] = useState<string | null>(null);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const [isInitializingUpload, setIsInitializingUpload] = useState(false);

  // Active TUS upload task & controller
  const [activeUpload, setActiveUpload] = useState<UploadTaskState | null>(null);
  const tusUploadRef = useRef<tus.Upload | null>(null);
  const lastProgressSampleRef = useRef<{ time: number; bytes: number }>({ time: 0, bytes: 0 });
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRef = useRef<HTMLInputElement | null>(null);

  // Modals (Preview, Edit, Delete Confirm)
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoRecord | null>(null);
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<VideoCategory>('islamic_lectures');
  const [editThumbDataUrl, setEditThumbDataUrl] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState<VideoRecord | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);

  const getToken = async (): Promise<string | null> => {
    try {
      return (await auth.currentUser?.getIdToken()) || null;
    } catch {
      return null;
    }
  };

  const fetchConfigAndVideos = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const [cfgRes, listRes] = await Promise.all([
        fetch('/api/v1/videos/config-status', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/v1/admin/videos?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (cfgRes.ok) {
        const cfgJson = await cfgRes.json();
        if (cfgJson?.success && cfgJson.data) {
          setCloudflareConfigured(Boolean(cfgJson.data.cloudflareConfigured));
          if (cfgJson.data.maxFileSizeBytes) {
            setMaxFileSizeBytes(Number(cfgJson.data.maxFileSizeBytes));
          }
        }
      }

      if (listRes.ok) {
        const listJson = await listRes.json();
        if (listJson?.success && listJson.data) {
          setVideos(listJson.data.items || []);
          if (typeof listJson.data.cloudflareConfigured === 'boolean') {
            setCloudflareConfigured(listJson.data.cloudflareConfigured);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin video catalog:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigAndVideos();
  }, [fetchConfigAndVideos]);

  // Automatic status polling for videos currently uploading or processing
  useEffect(() => {
    const processingVideos = videos.filter(
      (v) => v.uploadStatus === 'processing' || v.uploadStatus === 'uploading'
    );
    if (processingVideos.length === 0 || !cloudflareConfigured) return;

    const timer = setInterval(async () => {
      const token = await getToken();
      if (!token) return;
      for (const v of processingVideos.slice(0, 3)) {
        try {
          const res = await fetch(`/api/v1/videos/${v.id}/sync-status`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const json = await res.json();
            if (json?.success && json.data) {
              setVideos((prev) => prev.map((row) => (row.id === v.id ? json.data : row)));
            }
          }
        } catch {
          // transient polling failure ignored cleanly
        }
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [videos, cloudflareConfigured]);

  // Online/Offline listener for resumable TUS auto-recovery
  useEffect(() => {
    const handleOffline = () => {
      if (tusUploadRef.current && activeUpload?.status === 'uploading') {
        tusUploadRef.current.abort(false).catch(() => {});
        setActiveUpload((prev) =>
          prev
            ? {
                ...prev,
                status: 'offline_waiting',
                errorMessage: isAr
                  ? 'انقطع الاتصال بالإنترنت. تم إيقاف الرفع مؤقتاً وسيتم استئنافه تلقائياً عند عودة الشبكة.'
                  : 'Internet disconnected. Upload paused and will resume automatically when online.',
              }
            : null
        );
      }
    };

    const handleOnline = () => {
      if (tusUploadRef.current && activeUpload?.status === 'offline_waiting') {
        setActiveUpload((prev) =>
          prev ? { ...prev, status: 'uploading', errorMessage: undefined } : null
        );
        tusUploadRef.current.start();
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [activeUpload?.status, isAr]);

  const handleVideoFileSelect = (file: File | null) => {
    setFileError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const validation = validateVideoFileClient(file, maxFileSizeBytes);
    if (!validation.valid) {
      setSelectedFile(null);
      setFileError(isAr ? validation.messageAr : validation.messageEn);
      return;
    }
    setSelectedFile(file);
    if (!titleAr) {
      const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      setTitleAr(cleanBase);
    }
    if (!titleEn) {
      const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      setTitleEn(cleanBase);
    }
  };

  const handleThumbnailSelect = async (file: File | null, target: 'new' | 'edit') => {
    if (!file) return;
    setThumbError(null);
    try {
      const dataUrl = await compressThumbnailToDataUrl(file);
      if (target === 'new') {
        setCustomThumbDataUrl(dataUrl);
      } else {
        setEditThumbDataUrl(dataUrl);
      }
    } catch (err: any) {
      const msg = err?.message || (isAr ? 'تعذر معالجة الصورة المصغرة.' : 'Invalid thumbnail image.');
      setThumbError(msg);
      showToast(msg, 'error');
    }
  };

  const reportUploadStateToServer = async (
    videoId: number,
    state: 'uploading' | 'uploaded' | 'error',
    errorMessage?: string
  ) => {
    try {
      const token = await getToken();
      if (!token) return null;
      const res = await fetch(`/api/v1/videos/${videoId}/upload-state`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state, errorMessage }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json.data) {
          setVideos((prev) => prev.map((v) => (v.id === videoId ? json.data : v)));
          return json.data as VideoRecord;
        }
      }
    } catch {
      // non-fatal
    }
    return null;
  };

  const handleStartUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);

    if (!selectedFile) {
      setFileError(isAr ? 'يرجى اختيار ملف الفيديو أولاً.' : 'Please select a video file first.');
      return;
    }

    const validation = validateVideoFileClient(selectedFile, maxFileSizeBytes);
    if (!validation.valid) {
      setFileError(isAr ? validation.messageAr : validation.messageEn);
      return;
    }

    if (!titleAr.trim() || !titleEn.trim()) {
      setFileError(
        isAr
          ? 'يرجى إدخال العنوان العربي والعنوان الإنجليزي للفيديو.'
          : 'Both Arabic and English titles are required.'
      );
      return;
    }

    const token = await getToken();
    if (!token) {
      showToast(
        isAr ? 'يجب تسجيل الدخول بحساب المسؤول أولاً.' : 'Admin sign-in is required.',
        'error'
      );
      return;
    }

    setIsInitializingUpload(true);

    try {
      const fingerprint = await computeFileFingerprint(selectedFile);

      const initRes = await fetch('/api/v1/videos/upload-url', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleAr: titleAr.trim(),
          titleEn: titleEn.trim(),
          description: description.trim(),
          category,
          fileName: selectedFile.name,
          mimeType: selectedFile.type || 'video/mp4',
          fileSizeBytes: selectedFile.size,
          fileFingerprint: fingerprint,
        }),
      });

      const initJson = await initRes.json();

      if (!initRes.ok || !initJson?.success) {
        const errMsg =
          initJson?.error?.message ||
          (isAr ? 'تعذر بدء جلسة الرفع الآمنة.' : 'Could not initialize secure upload URL.');
        setFileError(errMsg);
        showToast(errMsg, 'error');
        setIsInitializingUpload(false);
        return;
      }

      const { video, uploadUrl } = initJson.data as {
        video: VideoRecord;
        uploadUrl: string;
      };

      // Upload custom thumbnail if selected
      let createdVideo = video;
      if (customThumbDataUrl) {
        try {
          const thumbRes = await fetch(`/api/v1/videos/${video.id}/thumbnail`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageDataUrl: customThumbDataUrl }),
          });
          if (thumbRes.ok) {
            const thumbJson = await thumbRes.json();
            if (thumbJson?.success && thumbJson.data) {
              createdVideo = thumbJson.data;
            }
          }
        } catch {
          // Thumbnail failure does not block video upload
        }
      }

      setVideos((prev) => [createdVideo, ...prev]);

      // Start Resumable TUS Upload directly to Cloudflare Stream edge
      lastProgressSampleRef.current = { time: Date.now(), bytes: 0 };
      setActiveUpload({
        videoId: createdVideo.id,
        publicId: createdVideo.publicId,
        fileName: selectedFile.name,
        bytesUploaded: 0,
        bytesTotal: selectedFile.size,
        percentage: 0,
        speedBytesPerSec: 0,
        status: 'uploading',
      });

      let markedUploading = false;

      const upload = new tus.Upload(selectedFile, {
        uploadUrl,
        chunkSize: 5 * 1024 * 1024, // 5MB chunks for resilient mobile network resume
        retryDelays: [0, 1500, 3000, 6000, 12000, 20000],
        storeFingerprintForResuming: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          filename: selectedFile.name,
          filetype: selectedFile.type || 'video/mp4',
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const now = Date.now();
          const elapsedSec = Math.max(0.25, (now - lastProgressSampleRef.current.time) / 1000);
          const deltaBytes = bytesUploaded - lastProgressSampleRef.current.bytes;
          const speed = deltaBytes > 0 ? deltaBytes / elapsedSec : 0;

          if (elapsedSec >= 0.8) {
            lastProgressSampleRef.current = { time: now, bytes: bytesUploaded };
          }

          if (!markedUploading && bytesUploaded > 0) {
            markedUploading = true;
            reportUploadStateToServer(createdVideo.id, 'uploading');
          }

          const pct = bytesTotal > 0 ? Math.min(100, Math.round((bytesUploaded / bytesTotal) * 100)) : 0;
          setActiveUpload((prev) =>
            prev
              ? {
                  ...prev,
                  bytesUploaded,
                  bytesTotal,
                  percentage: pct,
                  speedBytesPerSec: speed || prev.speedBytesPerSec,
                  status: 'uploading',
                }
              : null
          );
        },
        onError: async (error) => {
          const msg = isAr
            ? `توقف الرفع قبل الاكتمال: ${error.message || 'خطأ في الشبكة'}. يمكنك الضغط على استئناف لإكمال الرفع من آخر نقطة.`
            : `Upload interrupted: ${error.message}`;
          setActiveUpload((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'error',
                  errorMessage: msg,
                }
              : null
          );
          await reportUploadStateToServer(createdVideo.id, 'error', msg);
          showToast(msg, 'error');
        },
        onSuccess: async () => {
          setActiveUpload((prev) =>
            prev ? { ...prev, percentage: 100, status: 'completed' } : null
          );
          await reportUploadStateToServer(createdVideo.id, 'uploaded');
          showToast(
            isAr
              ? 'تم رفع ملف الفيديو بنجاح! جاري المعالجة والترميز عبر Cloudflare Stream.'
              : 'Video uploaded! Cloudflare Stream transcoding is now in progress.',
            'success'
          );
          // Reset upload form cleanly
          setSelectedFile(null);
          setTitleAr('');
          setTitleEn('');
          setDescription('');
          setCustomThumbDataUrl(null);
          if (videoInputRef.current) videoInputRef.current.value = '';
          if (thumbInputRef.current) thumbInputRef.current.value = '';
          tusUploadRef.current = null;
          // Trigger immediate status sync
          handleSyncStatus(createdVideo.id, true);
        },
      });

      tusUploadRef.current = upload;

      // Resume from previous TUS fingerprint if present
      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length > 0) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      upload.start();
    } catch (err: any) {
      const msg = err?.message || (isAr ? 'حدث خطأ أثناء تهيئة رفع الفيديو.' : 'Upload failed.');
      setFileError(msg);
      showToast(msg, 'error');
    } finally {
      setIsInitializingUpload(false);
    }
  };

  const handlePauseTus = async () => {
    if (!tusUploadRef.current) return;
    await tusUploadRef.current.abort(false);
    setActiveUpload((prev) => (prev ? { ...prev, status: 'paused' } : null));
  };

  const handleResumeTus = () => {
    if (!tusUploadRef.current) return;
    setActiveUpload((prev) =>
      prev ? { ...prev, status: 'uploading', errorMessage: undefined } : null
    );
    tusUploadRef.current.start();
  };

  const handleCancelTus = async () => {
    if (tusUploadRef.current) {
      await tusUploadRef.current.abort(true).catch(() => {});
      tusUploadRef.current = null;
    }
    if (activeUpload) {
      await reportUploadStateToServer(
        activeUpload.videoId,
        'error',
        isAr ? 'تم إلغاء الرفع بواسطة المسؤول قبل الاكتمال.' : 'Upload cancelled by admin before completion.'
      );
    }
    setActiveUpload(null);
  };

  const handleSyncStatus = async (videoId: number, silent = false) => {
    setSyncingId(videoId);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`/api/v1/videos/${videoId}/sync-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json?.success && json.data) {
        setVideos((prev) => prev.map((v) => (v.id === videoId ? json.data : v)));
        if (!silent) {
          showToast(
            isAr ? 'تم تحديث حالة المعالجة من Cloudflare Stream.' : 'Processing status synced.',
            'success'
          );
        }
      } else if (!silent) {
        showToast(json?.error?.message || 'Sync failed', 'error');
      }
    } catch {
      if (!silent) {
        showToast(isAr ? 'تعذر المزامنة مع خادم البث.' : 'Could not sync status.', 'error');
      }
    } finally {
      setSyncingId(null);
    }
  };

  const handleTogglePublish = async (video: VideoRecord) => {
    if (video.publicationStatus !== 'published' && (video.uploadStatus !== 'ready' || !video.playbackUrl)) {
      showToast(
        isAr
          ? 'لا يمكن نشر الفيديو قبل اكتمال معالجته وجاهزية البث (Ready).'
          : 'Video must be Ready before publishing.',
        'error'
      );
      return;
    }

    setPublishingId(video.id);
    try {
      const token = await getToken();
      if (!token) return;
      const nextStatus = video.publicationStatus === 'published' ? 'unpublished' : 'published';
      const res = await fetch(`/api/v1/admin/videos/${video.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicationStatus: nextStatus }),
      });
      const json = await res.json();
      if (res.ok && json?.success && json.data) {
        setVideos((prev) => prev.map((v) => (v.id === video.id ? json.data : v)));
        showToast(
          nextStatus === 'published'
            ? isAr
              ? 'تم نشر الفيديو وإتاحته في المكتبة المرئية العامة.'
              : 'Video published to public library.'
            : isAr
            ? 'تم إلغاء نشر الفيديو وإخفاؤه عن العامة.'
            : 'Video unpublished.',
          'success'
        );
      } else {
        showToast(json?.error?.message || 'Action failed', 'error');
      }
    } catch {
      showToast(isAr ? 'تعذر تغيير حالة النشر.' : 'Failed to update publication status.', 'error');
    } finally {
      setPublishingId(null);
    }
  };

  const openEditModal = (video: VideoRecord) => {
    setEditingVideo(video);
    setEditTitleAr(video.titleAr);
    setEditTitleEn(video.titleEn);
    setEditDescription(video.description || '');
    setEditCategory(video.category);
    setEditThumbDataUrl(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    setSavingEdit(true);
    try {
      const token = await getToken();
      if (!token) return;

      if (editThumbDataUrl) {
        await fetch(`/api/v1/videos/${editingVideo.id}/thumbnail`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageDataUrl: editThumbDataUrl }),
        });
      }

      const res = await fetch(`/api/v1/admin/videos/${editingVideo.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titleAr: editTitleAr.trim(),
          titleEn: editTitleEn.trim(),
          description: editDescription.trim(),
          category: editCategory,
        }),
      });
      const json = await res.json();
      if (res.ok && json?.success && json.data) {
        setVideos((prev) => prev.map((v) => (v.id === editingVideo.id ? json.data : v)));
        setEditingVideo(null);
        showToast(isAr ? 'تم حفظ تعديلات الفيديو بنجاح.' : 'Video updated.', 'success');
      } else {
        showToast(json?.error?.message || 'Update failed', 'error');
      }
    } catch {
      showToast(isAr ? 'تعذر حفظ التعديلات.' : 'Failed to save changes.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    setDeletingInProgress(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`/api/v1/admin/videos/${deletingVideo.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json?.success) {
        setVideos((prev) => prev.filter((v) => v.id !== deletingVideo.id));
        setDeletingVideo(null);
        showToast(
          isAr ? 'تم حذف الفيديو نهائياً من قاعدة البيانات وخادم البث.' : 'Video deleted.',
          'success'
        );
      } else {
        showToast(json?.error?.message || 'Delete failed', 'error');
      }
    } catch {
      showToast(isAr ? 'تعذر حذف الفيديو.' : 'Delete error.', 'error');
    } finally {
      setDeletingInProgress(false);
    }
  };

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return videos.filter((v) => {
      if (filterCategory !== 'all' && v.category !== filterCategory) return false;
      if (filterStatus !== 'all') {
        if (filterStatus === 'published' && v.publicationStatus !== 'published') return false;
        if (filterStatus === 'draft' && v.publicationStatus === 'published') return false;
        if (filterStatus === 'ready' && v.uploadStatus !== 'ready') return false;
        if (filterStatus === 'processing' && !['pending_upload', 'uploading', 'processing'].includes(v.uploadStatus)) return false;
        if (filterStatus === 'error' && v.uploadStatus !== 'error') return false;
      }
      if (!q) return true;
      return (
        v.titleAr.toLowerCase().includes(q) ||
        v.titleEn.toLowerCase().includes(q) ||
        v.publicId.toLowerCase().includes(q) ||
        v.streamVideoId.toLowerCase().includes(q)
      );
    });
  }, [videos, filterCategory, filterStatus, searchQuery]);

  const counts = useMemo(() => {
    return {
      total: videos.length,
      published: videos.filter((v) => v.publicationStatus === 'published' && v.uploadStatus === 'ready').length,
      processing: videos.filter((v) => ['pending_upload', 'uploading', 'processing'].includes(v.uploadStatus)).length,
      errors: videos.filter((v) => v.uploadStatus === 'error').length,
    };
  }, [videos]);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Cloudflare Stream Configuration Notice (Honest, Zero Faking) */}
      {!cloudflareConfigured && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FEF3C7] dark:bg-[#451A03]/60 border border-[#D97706]/50 text-[#78350F] dark:text-[#FDE68A] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#D97706]" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold">
              {isAr
                ? 'متغيرات Cloudflare Stream غير مضافة في بيئة الخادم الحالية'
                : 'Cloudflare Stream environment secrets are not configured yet'}
            </p>
            <p className="leading-relaxed">
              {isAr
                ? 'لبدء رفع الفيديوهات الحقيقية ومعالجتها عبر Cloudflare Stream، يرجى إضافة CLOUDFLARE_ACCOUNT_ID و CLOUDFLARE_API_TOKEN و CLOUDFLARE_STREAM_WEBHOOK_SECRET في إعدادات البيئة (Settings > Secrets). لن يقوم النظام بمحاكاة رفع وهمي.'
                : 'Add CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_STREAM_WEBHOOK_SECRET in server environment secrets to enable live Direct Creator TUS uploads.'}
            </p>
          </div>
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي الفيديوهات' : 'Total Videos', val: counts.total },
          { label: isAr ? 'منشور ومفعل' : 'Published & Live', val: counts.published },
          { label: isAr ? 'قيد الرفع والمعالجة' : 'Uploading / Processing', val: counts.processing },
          { label: isAr ? 'أخطاء تتطلب مراجعة' : 'Requires Attention', val: counts.errors },
        ].map((item, idx) => (
          <div key={idx} className="sky-card-3d p-4 rounded-2xl">
            <span className="text-xs font-bold text-[#2B547E] dark:text-[#B8DEF5] block">
              {item.label}
            </span>
            <span className="text-2xl font-black text-[#12345A] dark:text-white font-mono tabular-nums mt-1 block">
              {item.val}
            </span>
          </div>
        ))}
      </div>

      {/* Upload Video Form */}
      <section className="sky-card-3d rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black font-amiri text-[#12345A] dark:text-[#F7E7B4] flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#0EA5A4]" />
              <span>
                {isAr
                  ? 'رفع فيديو جديد إلى المكتبة المرئية (بث تكيفي HLS)'
                  : 'Upload New Video to Adaptive Stream Catalog'}
              </span>
            </h2>
            <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5] mt-1">
              {isAr
                ? 'رفع مجزأ قابل للاستئناف التلقائي (TUS) من الجوال والحاسوب · يدعم الملفات الكبيرة والاتصالات المتقطعة'
                : 'Resumable TUS direct upload from mobile & desktop · automatic retry on interrupted connections'}
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums font-bold text-[#0D7A7A] dark:text-[#2DD4BF]">
            Max: {formatBytes(maxFileSizeBytes)}
          </span>
        </div>

        <form onSubmit={handleStartUpload} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7">
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-2">
                {isAr ? 'ملف الفيديو (MP4, MOV, WEBM, MKV)' : 'Video File (MP4, MOV, WEBM, MKV)'}
              </label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="min-h-[120px] rounded-2xl border-2 border-dashed border-[#0EA5A4]/45 bg-[#EAF8FF] dark:bg-[#0A223D] hover:border-[#0EA5A4] p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors"
              >
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                  onChange={(e) => handleVideoFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Film className="w-7 h-7 text-[#0EA5A4]" />
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#12345A] dark:text-white break-all">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs font-mono tabular-nums text-[#0D7A7A] dark:text-[#2DD4BF]">
                      {formatBytes(selectedFile.size)} · {selectedFile.type || 'video'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-[#12345A] dark:text-[#F7E7B4]">
                      {isAr
                        ? 'اضغط لاختيار فيديو من الهاتف أو الكاميرا أو الحاسوب'
                        : 'Tap to choose video from phone, camera gallery, or desktop'}
                    </p>
                    <p className="text-[11px] text-[#4A7298] dark:text-[#84B4D6]">
                      {isAr
                        ? 'يُمنع تكرار رفع نفس الملف تلقائياً عبر البصمة الرقمية'
                        : 'Duplicate uploads are automatically detected by file fingerprint'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-2">
                {isAr ? 'صورة مصغرة مخصصة (اختياري)' : 'Custom Thumbnail (Optional)'}
              </label>
              <div
                onClick={() => thumbInputRef.current?.click()}
                className="min-h-[120px] rounded-2xl border border-[#12345A]/15 dark:border-[#87CEEB]/25 bg-[#EAF8FF] dark:bg-[#0A223D] hover:border-[#0EA5A4] p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors overflow-hidden"
              >
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleThumbnailSelect(e.target.files?.[0] || null, 'new')}
                  className="hidden"
                />
                {customThumbDataUrl ? (
                  <img
                    src={customThumbDataUrl}
                    alt={isAr ? 'معاينة الصورة المصغرة' : 'Thumbnail preview'}
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center space-y-1">
                    <ImageIcon className="w-6 h-6 text-[#0EA5A4] mx-auto" />
                    <span className="text-xs text-[#2B547E] dark:text-[#B8DEF5] block">
                      {isAr
                        ? 'رفع صورة غلاف (JPEG/PNG/WEBP)'
                        : 'Upload cover thumbnail (or auto-generate)'}
                    </span>
                  </div>
                )}
              </div>
              {thumbError && (
                <p className="text-xs text-[#DC2626] dark:text-[#FCA5A5] mt-1">{thumbError}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                {isAr ? 'العنوان بالعربية *' : 'Arabic Title *'}
              </label>
              <input
                type="text"
                required
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: تلاوة خاشعة من سورة الرحمن"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm text-[#12345A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                {isAr ? 'العنوان بالإنجليزية *' : 'English Title *'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Reverent Recitation of Surah Ar-Rahman"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm text-[#12345A] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
                {isAr ? 'التصنيف المعتمد *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoCategory)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm font-semibold text-[#12345A] dark:text-white"
              >
                {VIDEO_CATEGORY_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isAr ? cat.labelAr : cat.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#12345A] dark:text-[#EAF8FF] mb-1.5">
              {isAr ? 'الوصف والتفاصيل العلمية أو الخيرية' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isAr
                  ? 'نبذة تعريفية عن المحاضر أو القارئ ومحاور الدرس أو المشروع الخيري...'
                  : 'Brief overview of lecturer, Qari, topics covered, or charitable activity...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm text-[#12345A] dark:text-white"
            />
          </div>

          {fileError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 border border-[#DC2626]/40 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {/* Real-time Active TUS Upload Progress Bar */}
          {activeUpload && (
            <div className="p-4 rounded-2xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#D4AF37]/45 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#12345A] dark:text-white">
                  {activeUpload.status === 'offline_waiting' ? (
                    <WifiOff className="w-4 h-4 text-[#D97706]" />
                  ) : activeUpload.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0EA5A4]" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0EA5A4]" />
                  )}
                  <span className="truncate max-w-[240px]">{activeUpload.fileName}</span>
                </div>

                <div className="flex items-center gap-3 font-mono tabular-nums text-[#2B547E] dark:text-[#B8DEF5]">
                  <span>
                    {formatBytes(activeUpload.bytesUploaded)} / {formatBytes(activeUpload.bytesTotal)}
                  </span>
                  {activeUpload.speedBytesPerSec > 0 && activeUpload.status === 'uploading' && (
                    <span>{formatBytes(activeUpload.speedBytesPerSec)}/s</span>
                  )}
                  <span className="font-black text-[#12345A] dark:text-[#F7E7B4]">
                    {activeUpload.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full bg-white dark:bg-[#12345A] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    activeUpload.status === 'error'
                      ? 'bg-[#DC2626]'
                      : activeUpload.status === 'completed'
                      ? 'bg-[#0EA5A4]'
                      : 'bg-[#D4AF37]'
                  }`}
                  style={{ width: `${activeUpload.percentage}%` }}
                />
              </div>

              {activeUpload.errorMessage && (
                <p className="text-xs font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">
                  {activeUpload.errorMessage}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {activeUpload.status === 'uploading' && (
                  <button
                    type="button"
                    onClick={handlePauseTus}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#12345A] text-[#12345A] dark:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
                  </button>
                )}

                {(activeUpload.status === 'paused' ||
                  activeUpload.status === 'offline_waiting' ||
                  activeUpload.status === 'error') && (
                  <button
                    type="button"
                    onClick={handleResumeTus}
                    className="px-3.5 py-2 rounded-xl bg-[#12345A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isAr ? 'استئناف الرفع' : 'Resume Upload'}</span>
                  </button>
                )}

                {activeUpload.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={handleCancelTus}
                    className="px-3.5 py-2 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 text-[#B91C1C] dark:text-[#FCA5A5] text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إلغاء الرفع' : 'Cancel'}</span>
                  </button>
                )}

                {activeUpload.status === 'completed' && (
                  <button
                    type="button"
                    onClick={() => setActiveUpload(null)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#12345A] text-xs font-bold cursor-pointer"
                  >
                    {isAr ? 'إخفاء الشريط' : 'Dismiss'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isInitializingUpload || activeUpload?.status === 'uploading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
            >
              {isInitializingUpload ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>
                {isInitializingUpload
                  ? isAr
                    ? 'جاري تجهيز رابط الرفع الآمن...'
                    : 'Initializing Direct Upload...'
                  : isAr
                  ? 'بدء الرفع الآمن عبر Cloudflare Stream'
                  : 'Start Resumable Upload'}
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* Catalog Management List */}
      <section className="sky-card-3d rounded-3xl p-5 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-4">
          <h3 className="text-base sm:text-lg font-black font-amiri text-[#12345A] dark:text-[#F7E7B4]">
            {isAr ? 'إدارة ومراجعة الفيديوهات المرفوعة' : 'Uploaded Videos & Publication Queue'}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-[#0EA5A4] absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث بالعنوان أو المعرف...' : 'Search title or ID...'}
                className="w-full sm:w-52 min-h-[40px] ps-9 pe-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs text-[#12345A] dark:text-white"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-semibold text-[#12345A] dark:text-white"
            >
              <option value="all">{isAr ? 'كل التصنيفات' : 'All Categories'}</option>
              {VIDEO_CATEGORY_LIST.map((c) => (
                <option key={c.id} value={c.id}>
                  {isAr ? c.labelAr : c.labelEn}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-semibold text-[#12345A] dark:text-white"
            >
              <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="published">{isAr ? 'منشور للعامة' : 'Published'}</option>
              <option value="draft">{isAr ? 'مسودة / غير منشور' : 'Draft / Unpublished'}</option>
              <option value="ready">{isAr ? 'جاهز للبث (Ready)' : 'Ready'}</option>
              <option value="processing">{isAr ? 'قيد المعالجة' : 'Processing'}</option>
              <option value="error">{isAr ? 'به خطأ' : 'Errors'}</option>
            </select>

            <button
              type="button"
              onClick={fetchConfigAndVideos}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[#12345A] dark:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#2B547E] dark:text-[#B8DEF5] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0EA5A4]" />
            <span>{isAr ? 'جاري تحميل سجل الفيديوهات...' : 'Loading video catalog...'}</span>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-xs text-[#2B547E] dark:text-[#B8DEF5]">
            <Film className="w-8 h-8 mx-auto text-[#D4AF37]" />
            <p className="font-bold text-sm text-[#12345A] dark:text-white">
              {isAr ? 'لا توجد فيديوهات مطابقة للبحث حالياً' : 'No videos match your filter'}
            </p>
            <p>
              {isAr
                ? 'استخدم نموذج الرفع أعلاه لإضافة أول فيديو إسلامي أو تعليمي.'
                : 'Use the upload form above to add your first video.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#12345A]/10 dark:divide-[#87CEEB]/15">
            {filteredVideos.map((v) => {
              const catMeta = VIDEO_CATEGORY_MAP[v.category];
              const isReady = v.uploadStatus === 'ready' && Boolean(v.playbackUrl);
              const isPublished = v.publicationStatus === 'published';

              return (
                <div
                  key={v.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 shrink-0 flex items-center justify-center">
                      {v.thumbnailUrl ? (
                        <img
                          src={v.thumbnailUrl}
                          alt={v.titleAr}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-[#12345A] dark:text-white truncate">
                        {isAr ? v.titleAr : v.titleEn}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                        <span>{isAr ? catMeta?.labelAr : catMeta?.labelEn}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{v.publicId}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{formatBytes(v.fileSizeBytes)}</span>
                        {v.durationSeconds > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{formatDuration(v.durationSeconds)}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold pt-0.5">
                        <span
                          className={
                            v.uploadStatus === 'ready'
                              ? 'text-[#0D7A7A] dark:text-[#2DD4BF]'
                              : v.uploadStatus === 'error'
                              ? 'text-[#DC2626] dark:text-[#FCA5A5]'
                              : 'text-[#B45309] dark:text-[#FBBF24]'
                          }
                        >
                          {v.uploadStatus === 'ready'
                            ? isAr
                              ? 'جاهز للبث (100%)'
                              : 'Ready to Stream (100%)'
                            : v.uploadStatus === 'error'
                            ? isAr
                              ? 'خطأ في الرفع أو المعالجة'
                              : 'Error'
                            : v.uploadStatus === 'pending_upload'
                            ? isAr
                              ? 'بانتظار إكمال الرفع'
                              : 'Pending Upload'
                            : isAr
                            ? `جاري المعالجة (${v.processingProgress}%)`
                            : `Processing (${v.processingProgress}%)`}
                        </span>

                        <span aria-hidden="true" className="text-[#4A7298]">
                          ·
                        </span>

                        <span
                          className={
                            isPublished
                              ? 'text-[#12345A] dark:text-[#F7E7B4]'
                              : 'text-[#4A7298] dark:text-[#84B4D6]'
                          }
                        >
                          {isPublished
                            ? isAr
                              ? 'منشور بالمكتبة'
                              : 'Published'
                            : isAr
                            ? 'مسودة خاصة'
                            : 'Unpublished Draft'}
                        </span>
                      </div>

                      {v.errorMessage && (
                        <p className="text-xs text-[#DC2626] dark:text-[#FCA5A5]">{v.errorMessage}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSyncStatus(v.id)}
                      disabled={syncingId === v.id}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-[#12345A] dark:text-white"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === v.id ? 'animate-spin' : ''}`} />
                      <span>{isAr ? 'فحص الحالة' : 'Sync'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!isReady}
                      onClick={() => setPreviewVideo(v)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-[#12345A] dark:text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'معاينة' : 'Preview'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(v)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-[#12345A] dark:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={(!isReady && !isPublished) || publishingId === v.id}
                      onClick={() => handleTogglePublish(v)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-40 ${
                        isPublished
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#D4AF37]/40'
                          : 'bg-[#12345A] hover:bg-[#0E3F66] text-white'
                      }`}
                    >
                      {publishingId === v.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>
                        {isPublished
                          ? isAr
                            ? 'إلغاء النشر'
                            : 'Unpublish'
                          : isAr
                          ? 'نشر للمكتبة'
                          : 'Publish'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingVideo(v)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 text-[#B91C1C] dark:text-[#FCA5A5] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PREVIEW MODAL */}
      {previewVideo && previewVideo.playbackUrl && (
        <div className="fixed inset-0 z-50 bg-[#0A223D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-[#0F2747] border border-[#12345A]/25 dark:border-[#87CEEB]/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 bg-[#EAF8FF] dark:bg-[#0A223D] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-[#12345A] dark:text-white truncate">
                  {isAr ? previewVideo.titleAr : previewVideo.titleEn}
                </h4>
                <p className="text-xs text-[#2B547E] dark:text-[#B8DEF5]">
                  {isAr ? 'معاينة البث التكيفي قبل النشر' : 'Pre-publication HLS Stream Preview'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-2 rounded-xl bg-white dark:bg-[#12345A] text-[#12345A] dark:text-white cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <HlsVideoPlayer
                playbackUrl={previewVideo.playbackUrl}
                posterUrl={previewVideo.thumbnailUrl}
                title={isAr ? previewVideo.titleAr : previewVideo.titleEn}
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-[#0A223D]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-xl bg-white dark:bg-[#0F2747] border border-[#12345A]/25 dark:border-[#87CEEB]/30 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-[#12345A] dark:text-[#EAF8FF]"
          >
            <div className="flex items-center justify-between border-b border-[#12345A]/12 dark:border-[#87CEEB]/20 pb-3">
              <h4 className="font-black font-amiri text-lg text-[#12345A] dark:text-[#F7E7B4]">
                {isAr ? 'تعديل بيانات الفيديو والصورة المصغرة' : 'Edit Video Details'}
              </h4>
              <button type="button" onClick={() => setEditingVideo(null)} className="p-1.5 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isAr ? 'العنوان بالعربية' : 'Arabic Title'}
              </label>
              <input
                type="text"
                required
                value={editTitleAr}
                onChange={(e) => setEditTitleAr(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isAr ? 'العنوان بالإنجليزية' : 'English Title'}
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={editTitleEn}
                onChange={(e) => setEditTitleEn(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isAr ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as VideoCategory)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm"
              >
                {VIDEO_CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.labelAr : c.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isAr ? 'الوصف' : 'Description'}
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] border border-[#12345A]/15 dark:border-[#87CEEB]/25 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {isAr ? 'تحديث الصورة المصغرة (اختياري)' : 'Replace Thumbnail (Optional)'}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleThumbnailSelect(e.target.files?.[0] || null, 'edit')}
                className="text-xs"
              />
              {(editThumbDataUrl || editingVideo.thumbnailUrl) && (
                <img
                  src={editThumbDataUrl || editingVideo.thumbnailUrl || ''}
                  alt="Thumbnail"
                  referrerPolicy="no-referrer"
                  className="mt-2 h-28 rounded-xl object-cover"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 rounded-xl bg-[#12345A] hover:bg-[#0E3F66] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingVideo && (
        <div className="fixed inset-0 z-50 bg-[#0A223D]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0F2747] border border-[#DC2626]/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h4 className="font-black text-base text-[#B91C1C] dark:text-[#FCA5A5]">
              {isAr ? 'تأكيد حذف الفيديو نهائياً' : 'Confirm Permanent Deletion'}
            </h4>
            <p className="text-xs sm:text-sm text-[#2B547E] dark:text-[#B8DEF5] leading-relaxed">
              {isAr
                ? `هل أنت متأكد من حذف الفيديو "${deletingVideo.titleAr}"؟ سيتم حذفه من قاعدة البيانات وخادم البث (Cloudflare Stream) ولا يمكن التراجع عن ذلك.`
                : `Are you sure you want to permanently delete "${deletingVideo.titleEn}" from the database and Cloudflare Stream?`}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingVideo(null)}
                className="px-4 py-2 rounded-xl bg-[#EAF8FF] dark:bg-[#0A223D] text-xs font-bold cursor-pointer text-[#12345A] dark:text-white"
              >
                {isAr ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={deletingInProgress}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                {deletingInProgress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? 'حذف نهائي' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
