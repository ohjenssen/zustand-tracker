import { useState } from 'react';
import { useAuthStore } from '@/app/store/store';
import styles from './userSettings.module.css';
import LogoutButton from '@/app/components/LogoutButton/LogoutButton';

export default function UserSettings({ onClose }) {
	const user = useAuthStore((state) => state.user);
	const updateUser = useAuthStore((state) => state.updateUser);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState(null);

	const handleSave = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const formJson = Object.fromEntries(formData.entries());

		setIsSaving(true);
		setError(null);
		const { ok, errors } = await updateUser(formJson);
		setIsSaving(false);

		if (ok) {
			onClose();
		} else {
			// Viser første valideringsfeil fra API-et, f.eks. at e-posten er i bruk
			setError(errors ? Object.values(errors)[0][0] : 'Kunne ikke lagre. Prøv igjen.');
		}
	};

	return (
		<>
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

						{error && <p className={styles.error}>{error}</p>}

						<button type="submit" className={styles.saveButton} disabled={isSaving}>
							{isSaving ? 'Saving...' : 'Save Changes'}
						</button>

						<div className={styles.logoutContainer}>
							<LogoutButton />
						</div>
					</form>
				</div>
		</>
	);
}