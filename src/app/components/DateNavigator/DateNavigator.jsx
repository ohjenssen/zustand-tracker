'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './dateNavigator.module.css';

export default function DateNavigator({ selectedDate, setSelectedDate }) {
  // Hjelpefunksjon for å endre dato med +1 eller -1 dag
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Formaterer teksten som vises i midten
  const formatDateLabel = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Sammenlign kun dato-delen (YYYY-MM-DD)
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'I dag';
    if (dateStr === yesterdayStr) return 'I går';
    if (dateStr === tomorrowStr) return 'I morgen';

    // Ellers vis f.eks. "9. aug"
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={styles.container}>
      <button onClick={() => changeDate(-1)} className={styles.arrowButton}>
        <ChevronLeft size={28} />
      </button>

      <span className={styles.dateLabel}>{formatDateLabel(selectedDate)}</span>

      <button onClick={() => changeDate(1)} className={styles.arrowButton}>
        <ChevronRight size={28} />
      </button>
    </div>
  );
}