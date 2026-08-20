'use client';
import { useState, Suspense } from 'react';
import NativeBarcodeScanner from './NativeBarcodeScanner/NativeBarcodeScanner';
import styles from './scanPage.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '../components/Spinner/Spinner';
import { useAuthStore } from '../store/store';

function ScanPageContent() {
  const [scannedCode, setScannedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  
  // hooken kalles nå trygt under Suspense-grensen
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const mealId = searchParams.get('mealId');

  const router = useRouter();

  const handleScanSuccess = async (barcode) => {
    setScannedCode(barcode);
    setIsLoading(true);
    try {
      const res = await fetch(`https://foodtracker-api.oskarjenssen.com/api/food-products?barcode=${barcode}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (json.length === 0) {
        router.push(`/add-product?barcode=${barcode}`);
      } else if (json.length > 0) {
        router.push(`/details/${json[0].id}?mealId=${mealId}&date=${dateParam}`);
      }
    } catch (err) {
      console.error('Feil ved scanning:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className={styles.scannerArea}>
        {!scannedCode && (
          <>
            <h1 className={styles.title}>Skann strekkode for måtlid {mealId}</h1>
            <div className={styles.scannerWrapper}>
              <NativeBarcodeScanner onScanSuccess={handleScanSuccess} />
            </div>
          </>
        )}
        
        {isLoading && <Spinner />}
      </section>
    </main>
  );
}

// 2. Eksporten som pakker inn innholdet i Suspense
export default function ScanPage() {
  return (
    <Suspense fallback={<div className={styles.scannerArea}><Spinner /></div>}>
      <ScanPageContent />
    </Suspense>
  );
}