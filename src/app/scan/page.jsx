'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import NativeBarcodeScanner from '../components/NativeBarcodeScanner';
import styles from './scanPage.module.css';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/store';
import { useSearchParams } from 'next/navigation';

export default function ScanPage() {
    const [scannedCode, setScannedCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = useAuthStore((state) => state.token);
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const mealId = searchParams.get('meal');

  const router = useRouter();

  const handleScanSuccess = async (barcode) => {
    setScannedCode(barcode);
    try {
        const res = await fetch(`https://foodtracker-api.oskarjenssen.com/api/food-products?barcode=${barcode}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
                }
        });

        const json = await res.json();

        if(json.length === 0){
            router.push(`/add-product?barcode=${barcode}`);
        } else if (json.length > 0){
            router.push(`add-food?mealId=${mealId}&date=${dateParam}`);
        }
    } catch {

    }
  };

  return (
    <Suspense>
        <main>
            <section className={styles.scannerArea}>
                {!scannedCode && (
                    <>
                        <h1 className={styles.title}>Skann strekkode</h1>
                        <div className={styles.scannerWrapper}>
                            <NativeBarcodeScanner onScanSuccess={handleScanSuccess} />
                        </div>
                    </>
                )}
                
                {isLoading && <Spinner />}
        </section>
        </main>
    </Suspense>
  );
}