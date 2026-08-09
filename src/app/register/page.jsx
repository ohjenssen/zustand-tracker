"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('oskar_jenssen@hotmail.com');
  const [password, setPassword] = useState('************');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Her kaller du innloggingen din mot backend/state
    console.log('Logging in with:', { email, password });
  };

  return (
    <main className={styles.container}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        
        {/* Tilbake-knapp øverst til venstre for kortet */}
        <button 
          type="button" 
          onClick={() => router.back()} 
          className={styles.backButton}
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>

        {/* Det knallgrønne skjema-kortet */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            
            {/* Email-felt */}
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Passord-felt */}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            {/* Gul Log In-knapp */}
            <button type="submit" className={styles.submitButton}>
              Register
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}