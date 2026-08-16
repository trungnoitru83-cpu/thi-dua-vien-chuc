import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDocs,
  query
} from 'firebase/firestore';
import { db } from './firebase';
import { Teacher, Form01Data, Form03Evaluation } from '../types';

// Collection references
const TEACHERS_COL = 'teachers';
const FORM01_COL = 'form01';
const EVALUATIONS_COL = 'evaluations';

/**
 * Seed initial 36 teachers, Mẫu 01, Mẫu 03 into Firestore if collection is empty
 */
export async function syncInitialDataToFirestore(
  initialTeachers: Teacher[],
  initialForm01: Record<string, Form01Data>,
  initialEvaluations: Record<string, Form03Evaluation>
) {
  try {
    const teachersSnap = await getDocs(collection(db, TEACHERS_COL));
    if (teachersSnap.empty) {
      console.log('Seeding initial 36 teachers to Firestore...');
      for (const teacher of initialTeachers) {
        await setDoc(doc(db, TEACHERS_COL, teacher.id), teacher);
      }
    }

    const form01Snap = await getDocs(collection(db, FORM01_COL));
    if (form01Snap.empty) {
      console.log('Seeding initial Form 01 data to Firestore...');
      for (const [key, data] of Object.entries(initialForm01)) {
        await setDoc(doc(db, FORM01_COL, key), sanitizeForFirestore({ ...data, docKey: key }));
      }
    }

    const evalSnap = await getDocs(collection(db, EVALUATIONS_COL));
    if (evalSnap.empty) {
      console.log('Seeding initial Evaluations data to Firestore...');
      for (const [key, data] of Object.entries(initialEvaluations)) {
        await setDoc(doc(db, EVALUATIONS_COL, key), sanitizeForFirestore({ ...data, docKey: key }));
      }
    }
  } catch (error) {
    console.warn('Error seeding initial data to Firestore (will use local fallback):', error);
  }
}

/**
 * Listen to real-time changes for Teachers
 */
export function listenToTeachers(onData: (teachers: Teacher[]) => void) {
  return onSnapshot(
    query(collection(db, TEACHERS_COL)),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Teacher[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Teacher);
        });
        onData(list);
      }
    },
    (error) => {
      console.warn('Firestore listen error (teachers):', error);
    }
  );
}

/**
 * Listen to real-time changes for Form 01
 */
export function listenToForm01(onData: (form01Map: Record<string, Form01Data>) => void) {
  return onSnapshot(
    query(collection(db, FORM01_COL)),
    (snapshot) => {
      if (!snapshot.empty) {
        const map: Record<string, Form01Data> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const key = data.docKey || docSnap.id;
          const { docKey, ...cleanData } = data;
          map[key] = cleanData as Form01Data;
        });
        onData(map);
      }
    },
    (error) => {
      console.warn('Firestore listen error (form01):', error);
    }
  );
}

/**
 * Listen to real-time changes for Form 03 Evaluations
 */
export function listenToEvaluations(onData: (evalMap: Record<string, Form03Evaluation>) => void) {
  return onSnapshot(
    query(collection(db, EVALUATIONS_COL)),
    (snapshot) => {
      if (!snapshot.empty) {
        const map: Record<string, Form03Evaluation> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const key = data.docKey || docSnap.id;
          const { docKey, ...cleanData } = data;
          map[key] = cleanData as Form03Evaluation;
        });
        onData(map);
      }
    },
    (error) => {
      console.warn('Firestore listen error (evaluations):', error);
    }
  );
}

// Helper to clean undefined values before sending to Firestore
function sanitizeForFirestore<T>(data: T): any {
  return JSON.parse(JSON.stringify(data, (_, value) => {
    return value === undefined ? null : value;
  }));
}

/**
 * Save single Teacher
 */
export async function saveTeacherToFirestore(teacher: Teacher) {
  try {
    const cleanData = sanitizeForFirestore(teacher);
    await setDoc(doc(db, TEACHERS_COL, teacher.id), cleanData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving teacher to Firestore:', error);
    return { success: false, error };
  }
}

/**
 * Save single Form 01 entry
 */
export async function saveForm01ToFirestore(docKey: string, data: Form01Data) {
  try {
    const cleanData = sanitizeForFirestore({ ...data, docKey });
    await setDoc(doc(db, FORM01_COL, docKey), cleanData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving Form 01 to Firestore:', error);
    return { success: false, error };
  }
}

/**
 * Save single Evaluation entry
 */
export async function saveEvaluationToFirestore(docKey: string, data: Form03Evaluation) {
  try {
    const cleanData = sanitizeForFirestore({ ...data, docKey });
    await setDoc(doc(db, EVALUATIONS_COL, docKey), cleanData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error saving Evaluation to Firestore:', error);
    return { success: false, error };
  }
}
