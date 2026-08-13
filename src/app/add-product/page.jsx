'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import styles from './addProduct.module.css';

function AddProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barcode = searchParams.get('barcode') || '';

  const [formData, setFormData] = useState({
    name: '',
    variant: '',
    brand: '',
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    barcode: barcode,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send data til backend (Laravel)
      const res = await fetch('/api/food-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newProduct = await res.json();
        // Naviger tilbake til søk eller direkte til å legge til måltidet
        router.push(`/search`);
      } else {
            alert('Dette er ikke klart ennå, Synne. Takk.');
      }
    } catch (err) {
      console.error('Feil ved lagring:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header med tilbake-pil og tittel */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()} aria-label="Gå tilbake">
          <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>Legg til ny matvare</h1>
      </header>

      {/* Skjema */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.textInputsGroup}>
            <div className={styles.inlineInputRow}>
                <label htmlFor="name" className={styles.label}>Strekkode</label>
                <input
                type="text"
                id="name"
                name="name"
                value={barcode}
                onChange={handleChange}
                className={styles.underlineInput}
                disabled
                />
            </div>
          <div className={styles.inlineInputRow}>
            <label htmlFor="name" className={styles.label}>Matvare:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.underlineInput}
              required
            />
          </div>

          <div className={styles.inlineInputRow}>
            <label htmlFor="variant" className={styles.label}>Variant:</label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleChange}
              className={styles.underlineInput}
            />
          </div>

          <div className={styles.inlineInputRow}>
            <label htmlFor="brand" className={styles.label}>Merke:</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={styles.underlineInput}
            />
          </div>
        </div>

        <div className={styles.nutritionInputsGroup}>
          <div className={styles.nutritionRow}>
            <label htmlFor="proteins" className={styles.nutritionLabel}>Proteins</label>
            <input
              type="number"
              id="proteins"
              name="proteins"
              min="0"
              step="0.1"
              value={formData.proteins}
              onChange={handleChange}
              className={styles.nutritionInput}
            />
          </div>

          <div className={styles.nutritionRow}>
            <label htmlFor="fats" className={styles.nutritionLabel}>Fats</label>
            <input
              type="number"
              id="fats"
              name="fats"
              min="0"
              step="0.1"
              value={formData.fats}
              onChange={handleChange}
              className={styles.nutritionInput}
            />
          </div>

          <div className={styles.nutritionRow}>
            <label htmlFor="carbohydrates" className={styles.nutritionLabel}>Carbohydrates</label>
            <input
              type="number"
              id="carbohydrates"
              name="carbohydrates"
              min="0"
              step="0.1"
              value={formData.carbohydrates}
              onChange={handleChange}
              className={styles.nutritionInput}
            />
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
            {isSubmitting ? 'Lagrer...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Laster...</div>}>
      <AddProductContent />
    </Suspense>
  );
}