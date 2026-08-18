'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import styles from './addProduct.module.css';
import { useAuthStore } from '../store/store';

function AddProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barcodeParam = searchParams.get('barcode') || '';
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    name: '',
    variant: '',
    brand: '',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    barcode: barcodeParam,
  });

  // Sørg for at barcode oppdateres i formData dersom den finnes i URL
  useEffect(() => {
    if (barcodeParam) {
      setFormData((prev) => ({ ...prev, barcode: barcodeParam }));
    }
  }, [barcodeParam]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log("Data som sendes:", JSON.stringify(formData));

    try {
      const res = await fetch('https://foodtracker-api.oskarjenssen.com/api/food-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const newProduct = await res.json();
      console.log("Respons fra server:", newProduct);

      if (res.ok) {
        router.push(`/search`);
      } else {
        alert('Kunne ikke lagre matvaren. Sjekk konsollen for valideringsfeil.');
      }
    } catch (err) {
      console.error('Feil ved lagring:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()} aria-label="Gå tilbake">
          <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>Legg til ny matvare</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.textInputsGroup}>
          {/* Riktig oppsett for visning av strekkode */}
          <div className={styles.inlineInputRow}>
            <label htmlFor="barcode" className={styles.label}>Strekkode:</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
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
              id="fat"
              name="fat"
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