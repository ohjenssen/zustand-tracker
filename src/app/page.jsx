import Link from 'next/link';
import styles from './page.module.css';
import LandingRedirect from './components/LandingRedirect';

export default function LandingPage() {
    return (
        <main className={styles.container}>
            <LandingRedirect />

            <div className={styles.contentWrapper}>
                <h1 className={styles.welcomeText}>Welcome, please register a user or log in to an existing one.</h1>
                <div className={styles.buttonGroup}>
                    <Link href="/register" className={styles.registerButton}>Register</Link>
                    <Link href="/login" className={styles.loginButton}>Login</Link>
                </div>
            </div>
        </main>
    );
}