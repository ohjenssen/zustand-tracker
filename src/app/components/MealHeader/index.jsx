import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './mealHeader.module.css';

export default function MealHeader({ name }) {
  return (
    <header className={styles.header}>
        <Link href="/home" className={styles.backLink}>
            <ChevronLeft size={32} />
        </Link>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.spacer}></div>
    </header>
  );
}