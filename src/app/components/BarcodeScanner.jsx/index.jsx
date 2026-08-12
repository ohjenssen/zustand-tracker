'use client';
import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './barcodeScanner.module.css';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Konfigurasjon for scanneren
    const config = {
      fps: 10, // Hvor mange bilder per sekund scanneren leser
      qrbox: { width: 250, height: 150 }, // Størrelse på scanne-rammen (tilpasset strekkoder)
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true, // Viser lommelykt-knapp på støttede enheter
    };

    // Initialiserer scanneren i div-en med id "reader"
    const html5QrcodeScanner = new Html5QrcodeScanner("reader", config, false);

    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        // Når en strekkode leses inn vellykket
        if (onScanSuccess) {
          onScanSuccess(decodedText, decodedResult);
        }
      },
      (errorMessage) => {
        // Ved feil under scanning (f.eks. uklar strekkode)
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    );

    // Opprydding når komponenten avmonteres (fjerner kameratilgang)
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Klarte ikke å stoppe scanneren:", error);
      });
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className={styles.scannerWrapper}>
      {/* HTML5 QR-Code vil injisere kamera-feed her */}
      <div id="reader" className={styles.reader}></div>
    </div>
  );
}