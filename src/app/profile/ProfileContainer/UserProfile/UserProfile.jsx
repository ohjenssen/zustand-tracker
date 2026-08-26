'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Edit2, X, Ellipsis, Plus, Minus } from 'lucide-react';
import { useAuthStore } from '../../../store/store';
import Spinner from '@/app/components/Spinner/Spinner';
import styles from './userProfile.module.css';

export default function UserProfile({ onEdit = false }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  // Lås scrolling på bakgrunnen når modalen er åpen
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isModalOpen]);

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

  const handleSaveMacros = async (e) => {
    e.preventDefault();
    const payload = {
        gram_fat_need: fat,
        gram_carbohydrate_need: carbs,
        gram_protein_need: protein
    };

    try {
        await fetch(
            "https://foodtracker-api.oskarjenssen.com/api/user",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            },
        );
    } catch {
        console.error("Kunne ikke oppdatere makromål");
    }

    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Spinner container={true}/>
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
                <label className={styles.statsValue}>Carbohydrates</label>
                <label className={styles.statsValue}>{user?.gram_carbohydrate_need}g</label>
              </div>

              <div className={styles.labelContainer}>
                <label className={styles.statsValue}>Proteins</label>
                <label className={styles.statsValue}>{user?.gram_protein_need}g</label>
              </div>
            </div>
          </div>

          {/* Modal for redigering av makroer */}
          {isModalOpen && (
            <div 
              className={styles.modalOverlay} 
              onClick={() => setIsModalOpen(false)}
              onTouchMove={(e) => e.stopPropagation()}
            >
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
                  
                  {/* Protein Section */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.macroLabel}>Protein</span>
                      <div className={styles.numberStepper}>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setProtein(prev => Math.max(0, prev - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.sliderValue}>{protein}g</span>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setProtein(prev => prev < 300 ? prev + 1 : prev)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
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

                  {/* Karbohydrater Section */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.macroLabel}>Karbohydrater</span>
                      <div className={styles.numberStepper}>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setCarbs(prev => Math.max(0, prev - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.sliderValue}>{carbs}g</span>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setCarbs(prev => prev < 500 ? prev + 1 : prev)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
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

                  {/* Fett Section */}
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.macroLabel}>Fett</span>
                      <div className={styles.numberStepper}>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setFat(prev => Math.max(0, prev - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={styles.sliderValue}>{fat}g</span>
                        <button 
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setFat(prev => prev < 200 ? prev + 1 : prev)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
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