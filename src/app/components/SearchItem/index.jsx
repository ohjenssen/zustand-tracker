import { History } from 'lucide-react';
import Link from 'next/link';
import styles from './searchItem.module.css';

export default function SearchItem({ id, name, brand, mealId }) {
  // Hvis vi kom fra et spesifikt måltid, sender vi med mealId videre til detaljsiden
  const href = mealId ? `/details/${id}?mealId=${mealId}` : `/details/${id}`;

  return (
    <Link href={href} className={styles.itemLink}>
      <History className={styles.icon} size={24} />
      <span className={styles.title}>
        {name} {brand && <span className={styles.brand}>- {brand}</span>}
      </span>
    </Link>
  );
}