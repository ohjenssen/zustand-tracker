'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import NativeBarcodeScanner from '../components/NativeBarcodeScanner';
import styles from './scanPage.module.css';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleScanSuccess = async (barcode) => {
    setScannedCode(barcode);
    router.push(`/add-product?barcode=${barcode}`);
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