'use client';
import { useState } from 'react';
import { Suspense } from 'react';
import NativeBarcodeScanner from '../components/NativeBarcodeScanner';
import styles from './scanPage.module.css';

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState(null);

  const handleScanSuccess = async (barcode) => {
    console.log("Strekkode funnet:", barcode);
    setScannedCode(barcode);
    router.push(`/add-product?barcode=${barcode}`);
    // Eksempel: Søk opp produktet i din egen backend via strekkoden
    // const res = await fetch(`/api/food-products/barcode/${barcode}`);
    // if (res.ok) {
    //    const product = await res.json();
    //    router.push(`/details/${product.id}`);
    // }
  };

  return (
    <Suspense>
        <main>
            <section className={styles.scannerArea}>
                <h1 className={styles.title}>Skann strekkode</h1>
                
                {!scannedCode && (
                    <div className={styles.scannerWrapper}>
                        <NativeBarcodeScanner onScanSuccess={handleScanSuccess} />
                    </div>
                )}
        </section>
        </main>
    </Suspense>
  );
}