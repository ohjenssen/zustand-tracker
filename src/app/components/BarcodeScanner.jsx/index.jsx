'use client';
import { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import styles from './barcodeScanner.module.css';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  useEffect(() => {
    // 1. Definer spesifikt hvilke strekkodeformat vi ønsker å scanne (EAN, UPC, Code128)
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
      Html5QrcodeSupportedFormats.CODE_128,
    ];

    const html5Qrcode = new Html5Qrcode("reader", {
      formatsToSupport: formatsToSupport,
      verbose: false,
    });

    const config = {
      fps: 15, // Økt FPS for raskere respons
      qrbox: { width: 280, height: 160 }, // Rektangulær boks tilpasset 1D-strekkoder
      aspectRatio: 1.0,
    };

    // 2. Start scanneren ved å be om bakkameraet ("environment")
    html5Qrcode
      .start(
        { facingMode: "environment" }, // Tvinger bruk av bakkamera
        config,
        (decodedText, decodedResult) => {
          if (onScanSuccess) {
            onScanSuccess(decodedText, decodedResult);
          }
        },
        (errorMessage) => {
          if (onScanError) {
            onScanError(errorMessage);
          }
        }
      )
      .catch((err) => {
        console.error("Klarte ikke å starte kamera:", err);
      });

    // 3. Opprydding ved unmounte
    return () => {
      if (html5Qrcode.isScanning) {
        html5Qrcode
          .stop()
          .then(() => html5Qrcode.clear())
          .catch((err) => console.error("Feil ved stopp av scanner:", err));
      } else {
        html5Qrcode.clear();
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className={styles.scannerWrapper}>
      <div id="reader" className={styles.reader}></div>
    </div>
  );
}