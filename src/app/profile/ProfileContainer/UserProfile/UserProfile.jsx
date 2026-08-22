'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Edit2, X, Ellipsis } from 'lucide-react';
import { useAuthStore } from '../../../store/store';
import Spinner from '@/app/components/Spinner/Spinner';
import styles from './userProfile.module.css';

export default function UserProfile({ onEdit = false }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  // Synkroniser state med user-data når komponenten / user endrer seg
  useEffect(() => {
    if (user) {
      setProtein(user.gram_protein_need || 0);
      setCarbs(user.gram_carbohydrate_need || 0);
      setFat(user.gram_fat_need || 0);
    }
  }, [user]);

  function getTotalCalories(p = user?.gram_protein_need, c = user?.gram_carbohydrate_need, f = user?.gram_fat_need) {
    return (Number(p) || 0) * 4 + (Number(c) || 0) * 4 + (Number(f) || 0) * 9;
  }

  const totalDailyCalories = getTotalCalories();
  const estimatedNewCalories = getTotalCalories(protein, carbs, fat);

  // Dummy-funksjon for oppdatering av makronæringsstoffer
  const handleSaveMacros = (e) => {
    e.preventDefault();
    console.log('--- Ny makrofordeling lagret (Dummy) ---');
    console.log(`Protein: ${protein}g | Karbo: ${carbs}g | Fett: ${fat}g`);
    console.log(`Ny estimert total: ${estimatedNewCalories} kcal`);
    
    // Her kan du senere legge til API-kall: await updateMacros({ gram_protein_need: protein, ... })
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.container}>
          {/* Edit Icon top right */}
          <button
            onClick={onEdit}
            className={styles.editButton}
            aria-label="Rediger profil"
            type="button"
          >
            <Ellipsis />
          </button>

          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <UserCircle size={100} strokeWidth={1} className={styles.avatarIcon} />
            <div className={styles.userInfo}>
              <h1 className={styles.name}>{user?.name}</h1>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </div>

          {/* Main Stats Area */}
          <div className={styles.stats}>
            <div className={styles.titleWithEdit}>
              <h2 className={styles.statsTitle}>Daily calories</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className={styles.inlineEditBtn}
                aria-label="Rediger makronæringsstoffer"
                type="button"
              >
                <Edit2 size={18} />
              </button>
            </div>

            <label className={styles.kcalLabel}>{totalDailyCalories} kcal</label>
            <div className={styles.statsContainer}>
              <div className={styles.labelContainer}>
                <label className={styles.statsValue}>Fat</label>
                <label className={styles.statsValue}>{user?.gram_fat_need}g</label>
              </div>

              <div className={styles.labelContainer}>
                <label className={styles.statsValue}>Carbohydrate</label>
                <label className={styles.statsValue}>{user?.gram_carbohydrate_need}g</label>
              </div>

              <div className={styles.labelContainer}>
                <label className={styles.statsValue}>Protein</label>
                <label className={styles.statsValue}>{user?.gram_protein_need}g</label>
              </div>
            </div>
          </div>

          {/* Modal for redigering av makroer */}
          {isModalOpen && (
            <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
              <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  <X size={20} />
                </button>

                <h2 className={styles.modalTitle}>Rediger makromål</h2>
                <p className={styles.modalSubtitle}>Estimert: {estimatedNewCalories} kcal</p>

                <form onSubmit={handleSaveMacros} className={styles.sliderForm}>
                  {/* Protein Slider */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Protein</span>
                      <span className={styles.sliderValue}>{protein}g</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={protein}
                      onChange={(e) => setProtein(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  {/* Karbohydrater Slider */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Karbohydrater</span>
                      <span className={styles.sliderValue}>{carbs}g</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={carbs}
                      onChange={(e) => setCarbs(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  {/* Fett Slider */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span>Fett</span>
                      <span className={styles.sliderValue}>{fat}g</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={fat}
                      onChange={(e) => setFat(Number(e.target.value))}
                      className={styles.slider}
                    />
                  </div>

                  <button type="submit" className={styles.saveBtn}>Lagre endringer</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}