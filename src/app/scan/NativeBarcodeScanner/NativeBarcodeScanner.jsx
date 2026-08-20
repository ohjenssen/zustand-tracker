"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import styles from "./barcodeScanner.module.css";

export default function NativeBarcodeScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let animationFrameId = null;
    let codeReader = null;
    let isScanned = false;

    async function startScanner() {
      // Sjekk om det native BarcodeDetector API-et faktisk eksisterer
      const hasNativeDetector = "BarcodeDetector" in window;
      try {
        // 1. Start kamerastream (prøv bakkamera først, fall tilbake til standard kamera)
        const constraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        codeReader = new BrowserMultiFormatReader();

        codeReader.decodeFromVideoElement(videoRef.current, (result, err) => {
          if (result && !isScanned) {
            isScanned = true;

            if (onScanSuccess) onScanSuccess(result.getText());
          }
        });
      } catch (err) {
        console.error("Kamera- eller skannerfeil:", err);

        setError(
          "Klarte ikke å starte kameraet. Sjekk at du har gitt tillatelse.",
        );
      }
    }

    startScanner();

    // Opprydding
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      // ZXing har ingen direkte destroy-metode på reader, men at streamen stoppes er nok
    };
  }, [onScanSuccess]);

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.scannerWrapper}>
      <video ref={videoRef} className={styles.videoFeed} playsInline muted />

      <div className={styles.overlay}>
        <div className={styles.scanTarget} />
      </div>
    </div>
  );
}
