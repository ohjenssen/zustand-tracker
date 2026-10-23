'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Check } from 'lucide-react';
import { useAuthStore } from '@/app/store/store';
import styles from './saveMealForm.module.css';

export default function SaveMealForm({ foodComponents }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('idle'); // idle | saving | saved | error

    const createSavedMeal = useAuthStore((state) => state.createSavedMeal);

    if (!foodComponents || foodComponents.length === 0) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setStatus('saving');
        const products = foodComponents.map((food) => ({
            id: food.id,
            grams: food.gramsEaten || 0,
        }));

        const ok = await createSavedMeal(name.trim(), products);
        setStatus(ok ? 'saved' : 'error');
    };

    if (status === 'saved') {
        return (
            <div className={styles.savedMessage}>
                <Check size={18} strokeWidth={3} />
                <span>
                    Lagret som «{name.trim()}».{' '}
                    <Link href="/saved-meals" className={styles.link}>Se lagrede måltider</Link>
                </span>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button type="button" className={styles.openButton} onClick={() => setIsOpen(true)}>
                <Bookmark size={18} />
                Lagre som måltid
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
                <label htmlFor="savedMealName" className={styles.label}>Navn:</label>
                <input
                    id="savedMealName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    placeholder="Frokost"
                    className={styles.input}
                    autoFocus
                    required
                />
            </div>

            {status === 'error' && (
                <p className={styles.error}>Kunne ikke lagre. Prøv igjen.</p>
            )}

            <div className={styles.buttons}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsOpen(false)}>
                    Avbryt
                </button>
                <button type="submit" className={styles.saveButton} disabled={status === 'saving'}>
                    {status === 'saving' ? 'Lagrer...' : 'Lagre'}
                </button>
            </div>
        </form>
    );
}
