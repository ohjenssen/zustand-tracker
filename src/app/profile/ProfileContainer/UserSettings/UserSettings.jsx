import { useUserStore } from '../store/store';
import Spinner from './Spinner/Spinner';
import styles from './userSettings.module.css';

export default function UserSettings({ onClose }) {
  const name = useUserStore((state) => state.name);
  const email = useUserStore((state) => state.email);
  const age = useUserStore((state) => state.age);
  const dailyCalories = useUserStore((state) => state.dailyCalories);
  const loading = useUserStore((state) => state.loading);
  const updateUserInDB = useUserStore((state) => state.updateUserInDB);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.currentTarget; 
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries()); 
    updateUserInDB(formJson);

    onClose();
  };

  return (
    <>
      { loading ? (
        <Spinner size='lg'/> 
      ) : (
        <div className={styles.overlay} onClick={onClose}>
          <form 
            onSubmit={handleSave} 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.srOnly}>Edit Profile</h2>

            <div>
              <label className={styles.label}>Name</label>
              <input type="text" name="name" defaultValue={name} className={styles.input} />

              <label className={styles.label}>Email</label>
              <input type="email" name="email" defaultValue={email} className={styles.input} />

              <label className={styles.label}>Age</label>
              <input type="number" name="age" defaultValue={age} className={styles.input} />

              <label className={styles.label}>Daily calories</label>
              <input type="number" name="dailyCalories" defaultValue={dailyCalories} className={styles.input} />
            </div>

            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        </div>
      )}
    </>
  );
}