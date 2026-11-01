import { History } from 'lucide-react';
import Link from 'next/link';
import styles from './searchItem.module.css';
import { useSearchParams } from 'next/navigation';

export default function SearchItem({ mealId, food }) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const params = new URLSearchParams();
  if (mealId) params.set('mealId', mealId);
  if (dateParam) params.set('date', dateParam);
  const href = `/details/${food.id}?${params.toString()}`;

  return (
    <Link href={href} className={styles.itemLink}>
      <History className={styles.icon} size={24} />
      <span className={styles.title}>
        {food.name}{food.variant && <span className={styles.brand}> / {food.variant}</span>} {food.brand && <span className={styles.brand}>/ {food.brand}</span>}
      </span>
    </Link>
  );
}