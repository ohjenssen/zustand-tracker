import styles from './mealHeader.module.css';

export default function MealHeader({ name }) {
  return (
    <header className={styles.header}>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.spacer}></div>
    </header>
  );
}