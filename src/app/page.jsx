'use client' 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import AuthInitializer from './components/AuthInitializer';

export default function LandingPage() {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            router.replace('/home'); // 'replace' er bedre enn 'push' her så de slipper å trykke "Tilbake" til landingpage
            setIsCheckingAuth(false);
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    return (
        <main className={styles.container}>
            <AuthInitializer />
            {isCheckingAuth ? 
                <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
                    {/* <p>Laster...</p> */}
                </div> :

                <div className={styles.contentWrapper}>
                    <h1 className={styles.welcomeText}>Welcome, please register a user or log in to an existing one.</h1>
                    <div className={styles.buttonGroup}>
                        <Link href="/register" className={styles.registerButton}>Register</Link>
                        <Link href="/login" className={styles.loginButton}>Login</Link>
                    </div>
                </div>
            }
        </main>
    );
}