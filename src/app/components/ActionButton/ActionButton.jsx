import styles from './actionButton.module.css';

export default function ActionButton({ icon: Icon, onClick, color, ariaLabel }) {
  return (
    <button 
      onClick={onClick}
      className={styles.button}
      style={color ? { backgroundColor: color } : undefined}
      aria-label={ariaLabel}
      type="button"
    >
      <Icon size={32} />
    </button>
  );
}