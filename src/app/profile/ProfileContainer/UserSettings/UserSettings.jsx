import { useUserStore, useAuthStore } from '@/app/store/store';
import Spinner from '@/app/components/Spinner/Spinner';
import styles from './userSettings.module.css';
import LogoutButton from '@/app/components/LogoutButton/LogoutButton';

export default function UserSettings({ onClose }) {
	const user = useAuthStore((state) => state.user);;
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
							<input type="text" name="name" defaultValue={user.name} className={styles.input} />

							<label className={styles.label}>Email</label>
							<input type="email" name="email" defaultValue={user.email} className={styles.input} />
						</div>

						<button type="submit" className={styles.saveButton}>Save Changes</button>

						<div className={styles.logoutContainer}>
							<LogoutButton />
						</div>
					</form>
				</div>
			)}
		</>
	);
}