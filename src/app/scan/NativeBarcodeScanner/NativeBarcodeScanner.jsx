'use client';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import styles from './barcodeScanner.module.css';

export default function NativeBarcodeScanner({ onScanSuccess }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    let codeReader = null;
    let isScanned = false;

    async function startScanner() {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
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

        // Start dekoding fra video-elementet
        codeReader.decodeFromVideoElement(videoRef.current, (result, err) => {
          if (result && !isScanned) {
            isScanned = true;
            if (onScanSuccess) onScanSuccess(result.getText());
          }

          // Håndtering av feilmeldinger per ramme:
          if (err) {
            // Ignorer forventede scanner-feil når ingen/halv strekkode oppdages i rammen
            const isExpectedException = 
              err instanceof NotFoundException || 
              err instanceof ChecksumException || 
              err instanceof FormatException;

            if (!isExpectedException) {
              // Kun logg dersom det oppstår en uventet kritisk feil
              // console.error(err); 
            }
          }
        });
      } catch (err) {
        console.error('Kamera- eller skannerfeil:', err);
        setError('Klarte ikke å starte kameraet. Sjekk at du har gitt tillatelse.');
      }
    }

    startScanner();

    // Viktig opprydding
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (codeReader) {
        // Stopper skanneloopen fullstendig når komponenten unmountes
        codeReader.reset();
      }
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