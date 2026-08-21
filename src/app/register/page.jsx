"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import BackButton from '../components/BackButton/BackButton';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbohydrate, setCarbohydrate] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Her kaller du innloggingen din mot backend/state
    console.log('Logging in with:', { email, password });
  };

  return (
    <main className={styles.container}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Det knallgrønne skjema-kortet */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Registrer</h1>

            <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            
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

            <div className={styles.inputGroup}>
                <label htmlFor="protein" className={styles.label}>
                    Protein
                </label>
                <input
                    id="protein"
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className={styles.nutritionInput}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="fat" className={styles.label}>
                    Fat
                </label>
                <input
                    id="fat"
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className={styles.nutritionInput}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="carbohydrate" className={styles.label}>
                    Carbohydrates
                </label>
                <input
                    id="carbohydrate"
                    type="number"
                    value={carbohydrate}
                    onChange={(e) => setCarbohydrate(e.target.value)}
                    className={styles.nutritionInput}
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

      <BackButton />
    </main>
  );
}