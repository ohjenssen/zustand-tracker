'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BarcodeScanner from '@/app/components/BarcodeScanner';
import { Suspense } from 'react';
import NativeBarcodeScanner from '../components/NativeBarcodeScanner';

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState(null);
  const router = useRouter();

  const handleScanSuccess = async (barcode) => {
    console.log("Strekkode funnet:", barcode);
    setScannedCode(barcode);

    // Eksempel: Søk opp produktet i din egen backend via strekkoden
    // const res = await fetch(`/api/food-products/barcode/${barcode}`);
    // if (res.ok) {
    //    const product = await res.json();
    //    router.push(`/details/${product.id}`);
    // }
  };

  return (
    <Suspense>
        <main style={{ padding: '1rem', color: '#fff' }}>
            <h1>Skann strekkode</h1>
        
        {!scannedCode ? (
            // <BarcodeScanner onScanSuccess={handleScanSuccess} />
            <NativeBarcodeScanner onScanSuccess={handleScanSuccess} />
        ) : (
            <div>
                <p>Fant kode: <strong>{scannedCode}</strong></p>
                <button onClick={() => setScannedCode(null)}>Skann på nytt</button>
            </div>
        )}
        </main>
    </Suspense>
  );
}