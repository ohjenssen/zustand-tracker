'use client';
import { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import styles from './barcodeScanner.module.css';

export default function BarcodeScanner({ onScanSuccess, onScanError }) {
  useEffect(() => {
    // 1. Definer kun de mest relevante formatene for matvarer
    const formatsToSupport = [
      Html5QrcodeSupportedFormats.EAN_13,
      Html5QrcodeSupportedFormats.EAN_8,
      Html5QrcodeSupportedFormats.UPC_A,
      Html5QrcodeSupportedFormats.UPC_E,
    ];

    const html5Qrcode = new Html5Qrcode("reader", {
      formatsToSupport: formatsToSupport,
      verbose: false,
    });

    // 2. Ytelsesoptimalisert konfigurasjon
    const config = {
      fps: 30, // Maksimal opdateringsfrekvens
      aspectRatio: 1.0,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        return {
          width: Math.floor(viewfinderWidth * 0.85),
          height: Math.floor(viewfinderHeight * 0.45),
        };
      },
      // Her legger vi kamerakravene for høy oppløsning (kun i config-objektet)
      videoConstraints: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    };

    // 3. Start skanneren med KUN 1 nøkkel i det første argumentet
    html5Qrcode
      .start(
        { facingMode: "environment" }, // Eksakt 1 nøkkel
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