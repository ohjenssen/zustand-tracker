"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import BackButton from '../components/BackButton/BackButton';
import { useAuthStore } from '../store/store';

export default function RegisterPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbohydrate, setCarbohydrate] = useState('');
    const [password, setPassword] = useState('');
    const [total_calories_consumed, setTotalCaloriesConsumed] = useState('0');

    const setUser = useAuthStore((state) => state.setUser);
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleRegister = async (formData) => {
        try {
            const res = await fetch('https://foodtracker-api.oskarjenssen.com/api/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setAuth(data.access_token);
                router.push('/home');
            } else {
                console.error('Feil ved registrering:', data);
            }
        } catch (err) {
            console.error('Nettverksfeil:', err);
        }
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        name,
        email,
        gram_protein_need: Number(protein),
        gram_fat_need: Number(fat),
        gram_carbohydrate_need: Number(carbohydrate),
        total_calories_consumed,
        password,
    };

    handleRegister(payload);
  };

  return (
    <main className={styles.container}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Registrer</h1>

            <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="protein" className={styles.label}>Protein (g)</label>
                <input
                    id="protein"
                    name="gram_protein_need"
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className={styles.nutritionInput}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="fat" className={styles.label}>Fat (g)</label>
                <input
                    id="fat"
                    name="gram_fat_need"
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className={styles.nutritionInput}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="carbohydrate" className={styles.label}>Carbohydrates (g)</label>
                <input
                    id="carbohydrate"
                    name="gram_carbohydrate_need"
                    type="number"
                    value={carbohydrate}
                    onChange={(e) => setCarbohydrate(e.target.value)}
                    className={styles.nutritionInput}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

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