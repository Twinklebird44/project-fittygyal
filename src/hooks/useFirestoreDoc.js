import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Shared hook that syncs state to a Firestore document at:
 *   users/{uid}/data/{docName}
 *
 * @param {string} docName - Name of the Firestore document
 * @param {*} defaultValue - Default value if no document exists
 * @returns {{ data, setData, loading, saving }}
 */
export function useFirestoreDoc(docName, defaultValue) {
  const { user } = useAuth();
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isInitialLoad = useRef(true);
  const debounceTimer = useRef(null);

  // Load data from Firestore on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid, 'data', docName);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setData(snap.data().value);
        } else {
          // No data yet — use the default and save it
          setData(defaultValue);
          await setDoc(docRef, { value: defaultValue });
        }
      } catch (err) {
        console.error(`Error loading ${docName}:`, err);
      } finally {
        setLoading(false);
        // Mark initial load complete after a tick so the save effect doesn't fire
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 0);
      }
    };

    isInitialLoad.current = true;
    setLoading(true);
    loadData();

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [user, docName]);

  // Save to Firestore whenever data changes (debounced, skips initial load)
  useEffect(() => {
    if (!user || isInitialLoad.current || loading) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const docRef = doc(db, 'users', user.uid, 'data', docName);
        await setDoc(docRef, { value: data });
      } catch (err) {
        console.error(`Error saving ${docName}:`, err);
      } finally {
        setSaving(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, user, docName, loading]);

  return { data, setData, loading, saving };
}
