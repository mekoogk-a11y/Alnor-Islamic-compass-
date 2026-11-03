import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { OrphanApplication } from '../types';

const COLLECTION_NAME = 'orphan_applications';

export const orphansFirebaseService = {
  /**
   * Save a new orphan application to Firestore
   */
  async submitApplication(application: OrphanApplication): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, application.id);
      await setDoc(docRef, {
        ...application,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${application.id}`);
    }
  },

  /**
   * Look up application by tracking number or phone
   */
  async lookupApplication(queryStr: string): Promise<OrphanApplication | null> {
    try {
      const qClean = queryStr.trim().toUpperCase();
      
      // Try by tracking number first
      const qTracking = query(
        collection(db, COLLECTION_NAME), 
        where('trackingNumber', '==', qClean)
      );
      const snap = await getDocs(qTracking);
      if (!snap.empty) {
        return snap.docs[0].data() as OrphanApplication;
      }

      // Try by phone
      const qPhone = query(
        collection(db, COLLECTION_NAME),
        where('phone', '==', queryStr.trim())
      );
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) {
        return snapPhone.docs[0].data() as OrphanApplication;
      }

      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    }
  },

  /**
   * Update application status (admin)
   */
  async updateApplicationStatus(id: string, status: OrphanApplication['status'], fieldNotes?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updates: any = {
        status,
        updatedAt: new Date().toISOString()
      };
      if (fieldNotes) updates.fieldNotes = fieldNotes;
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    }
  },

  /**
   * Listen to applications in real-time
   */
  subscribeApplications(onData: (apps: OrphanApplication[]) => void, onError?: (err: any) => void) {
    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const apps: OrphanApplication[] = [];
        snapshot.forEach((d) => {
          apps.push(d.data() as OrphanApplication);
        });
        onData(apps);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    );
  }
};
