import styles from './spinner.module.css';

export default function Spinner({ size = 'md', color }) {
  // Mapper størrelsene til klassene i CSS-filen
  const sizeClass = styles[size] || styles.md;

  return (
    <span className={styles.wrapper}>
      <div
        className={`${styles.spinner} ${sizeClass}`}
        style={color ? { color } : undefined}
        role="status"
      >
        <span className={styles.srOnly}>Laster inn...</span>
      </div>
    </span>
  );
}