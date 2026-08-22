import styles from './spinner.module.css';

export default function Spinner({container = false, size = 'md', color, isHiding = false }) {
  const sizeClass = styles[size] || styles.md;

  return (
    <>
        {container ? 
        <div className={styles.loadingContainer}>
            <span className={`${styles.wrapper} ${isHiding ? styles.fadeOut : ''}`}>
                <div
                className={`${styles.spinner} ${sizeClass}`}
                style={color ? { color } : undefined}
                role="status"
                >
                    <span className={styles.srOnly}>Laster inn...</span>
                </div>
            </span> 
        </div> : 
        
        <span className={`${styles.wrapper} ${isHiding ? styles.fadeOut : ''}`}>
            <div
                className={`${styles.spinner} ${sizeClass}`}
                style={color ? { color } : undefined}
                role="status"
                >
                <span className={styles.srOnly}>Laster inn...</span>
            </div>
        </span>
        }
    </>
  );
}