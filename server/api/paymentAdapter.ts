import { DonationIntentRequest, DonationReceipt } from '../../src/types';

interface StoredDonation {
  id: string;
  intent: DonationIntentRequest;
  status: 'pending' | 'succeeded' | 'failed';
  receipt?: DonationReceipt;
  createdAt: string;
}

class WaqfPaymentGatewayAdapter {
  private donations = new Map<string, StoredDonation>();
  private processedIdempotencyKeys = new Set<string>();

  createDonationIntent(
    request: DonationIntentRequest, 
    idempotencyKey?: string
  ): { clientSecret: string; intentId: string; amount: number; currency: string } {
    if (idempotencyKey && this.processedIdempotencyKeys.has(idempotencyKey)) {
      // Return existing intent
      const existing = Array.from(this.donations.values()).find((d) => d.id === idempotencyKey);
      if (existing) {
        return {
          clientSecret: `sec_${existing.id}_live`,
          intentId: existing.id,
          amount: existing.intent.amount,
          currency: existing.intent.currency,
        };
      }
    }

    const intentId = `don_intent_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const stored: StoredDonation = {
      id: intentId,
      intent: request,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.donations.set(intentId, stored);
    if (idempotencyKey) {
      this.processedIdempotencyKeys.add(idempotencyKey);
    }

    return {
      clientSecret: `sec_${intentId}_live_token`,
      intentId,
      amount: request.amount,
      currency: request.currency || 'USD',
    };
  }

  verifyPayment(intentId: string): { verified: boolean; receipt?: DonationReceipt; error?: string } {
    const donation = this.donations.get(intentId);
    if (!donation) {
      return { verified: false, error: 'لم يتم العثور على معاملة مطابقة لهذا المعرف' };
    }

    donation.status = 'succeeded';
    const receipt: DonationReceipt = {
      receiptId: `RCP-WAQF-${Date.now().toString().slice(-6)}`,
      transactionRef: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      projectId: donation.intent.projectId,
      projectTitle: 'سهم وقفي - كفالة الحلقات ورعاية حفظة كتاب الله',
      amount: donation.intent.amount,
      currency: donation.intent.currency || 'USD',
      donorName: donation.intent.isAnonymous ? 'فاعل خير (وقف لوجه الله)' : (donation.intent.donorName || 'مساهم كريم'),
      date: new Date().toISOString(),
      status: 'succeeded',
      verificationHash: `SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
    };

    donation.receipt = receipt;
    return { verified: true, receipt };
  }

  getReceipt(receiptId: string): DonationReceipt | null {
    for (const d of this.donations.values()) {
      if (d.receipt && d.receipt.receiptId === receiptId) {
        return d.receipt;
      }
    }
    return null;
  }
}

export const paymentAdapter = new WaqfPaymentGatewayAdapter();
