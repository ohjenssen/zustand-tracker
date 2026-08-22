import { useRouter } from 'next/navigation';
import styles from './logoutButton.module.css'
import { useAuthStore } from '@/app/store/store';

export default function LogoutButton() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    function handleLogout() {
        logout();
        setTimeout(() => {
        router.push('/');
        }, 1000);
    }

    return (
        <button onClick={handleLogout} className={styles.logoutButton} type="button">Log out</button>
    )
}
