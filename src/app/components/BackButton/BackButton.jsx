'use client';

import styles from "./backButton.module.css";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // Next navigation er det nye

export default function BackButton() {
  const router = useRouter();

  function handleClick() {
    router.back(); // Tar brukeren ett hakk tilbake i historikken
  }

  return (
    <button 
      className={styles.button} 
      onClick={handleClick}
      aria-label="Gå tilbake"
      type="button"
    >
      <ChevronLeft size={28} />
    </button>
  );
}

