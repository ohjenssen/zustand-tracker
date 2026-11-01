"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './login.module.css';
import { useAuthStore } from '../store/store';
import BackButton from '@/app/components/BackButton/BackButton';
import { API_URL } from '@/app/utils/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('oskar_jenssen@hotmail.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const setUser = useAuthStore((state) => state.setUser);
    const setToken = useAuthStore((state) => state.setToken);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'Feil ved innlogging');
            }

            if (json.access_token) {
                    setUser(json.user);
                    setToken(json.access_token);
                    return router.replace('/home');
            }
        } catch (error) {
            // Lagre kun meldingen: et Error-objekt kan ikke rendres i JSX
            setError(error.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }

    };

    return (
        <main className={styles.container}>
            <div style={{ width: '100%', maxWidth: '380px' }}>

                <button type="button" onClick={() => router.back()} className={styles.backButton} >
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>{error}</p>
                        )}

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>

                    </form>
                </div>

            </div>

            <BackButton />
        </main>
    );
}