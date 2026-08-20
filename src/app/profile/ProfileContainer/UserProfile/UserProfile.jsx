import { UserCircle, Edit2 } from 'lucide-react';
import { useUserStore, useAuthStore } from '../../../store/store';
import Spinner from '@/app/components/Spinner/Spinner';
import { useRouter } from 'next/navigation';
import styles from './userProfile.module.css';

export default function UserProfile({ onEdit = false }) {
    const router = useRouter();
    const name = useUserStore((state) => state.name);
    const email = useUserStore((state) => state.email);
    const age = useUserStore((state) => state.age);
    const dailyCalories = useUserStore((state) => state.dailyCalories);
    const logout = useAuthStore((state) => state.logout);
    const isLoading = useAuthStore((state) => state.isLoading);

    function handleLogout(){
        logout();
        setTimeout(() => {
            router.push('/');
        }, 1000);
    }

    return (
        <>
            { isLoading ? <Spinner /> : 
            <div className={styles.container}>
                {/* Edit Icon top right */}
                <button 
                    onClick={onEdit} 
                    className={styles.editButton}
                    aria-label="Rediger profil"
                    type="button"
                >
                    <Edit2 size={24} />
                </button>

                {/* Profile Header */}
                <div className={styles.profileHeader}>
                    <UserCircle size={100} strokeWidth={1} className={styles.avatarIcon} />
                    <div className={styles.userInfo}>
                        <h1 className={styles.name}>{name}</h1>
                        <p className={styles.email}>{email}</p>
                        <p className={styles.age}>{age} years old</p>
                    </div>
                </div>

                {/* Main Stats Area */}
                <div className={styles.statsContainer}>
                    <h2 className={styles.statsTitle}>Daily calories</h2>
                    <p className={styles.statsValue}>{dailyCalories}</p>
                </div>

                <button 
                    onClick={handleLogout} 
                    className={styles.logoutButton}
                    type="button"
                >
                    Log out
                </button>
            </div>
            }
        </>
    );
}