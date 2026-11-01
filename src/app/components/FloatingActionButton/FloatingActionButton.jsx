'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, Scan, Search, CookingPot} from 'lucide-react';
import styles from './floatingActionButton.module.css';

// mealId: legg til i et eksisterende måltid. Uten mealId lages et nytt måltid på valgt dato.
export default function FloatingActionButton({ date, mealId }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFab = () => setIsOpen((prev) => !prev);
    const closeFab = () => setIsOpen(false);

    const params = new URLSearchParams({ mealId: mealId ?? 'new' });
    if (date) params.set('date', date);

    const actions = [
        {
            id: 'scan',
            label: 'Skann',
            icon: <Scan size={20} />,
            href: `/scan?${params.toString()}`,
        },
        {
            id: 'search',
            label: 'Søk etter matprodukt',
            icon: <Search  />,
            href: `/search?${params.toString()}`,
        },
        {
            id: 'savedMeal',
            label: 'Lagrede måltider',
            icon: <CookingPot />,
            href: `/saved-meals?date=${date}`,
            // Et lagret måltid blir alltid et nytt måltid, så det gir bare mening uten mealId
            hidden: Boolean(mealId),
        },
    ];

  // Plassene i buen beregnes ut fra alle knappene, også skjulte,
  // slik at hver knapp alltid ligger på samme sted
  const totalActions = actions.length;

  // Beregn dynamisk størrelse og avstand basert på antall knapper
  const buttonSize = totalActions > 4 ? 40 : 50;
  const radius = totalActions > 4 ? 85 : 100;

  // Vinkler for buen (fra 180° / Venstre til 270° / Topp)
  const startAngle = 180;
  const endAngle = 270;

  return (
    <>
        <div className={`${styles.fabOverlay} ${isOpen ? styles.active : ''}`} onClick={closeFab} />

        <div className={styles.fabContainer}>
            {/* Action Buttons */}
            <div className={`${styles.fabActions} ${isOpen ? styles.active : ''}`}>
                {actions.map((action, index) => {
                    if (action.hidden) return null;

                    // Beregn vinkel for hver knapp i radiane
                    const angleDeg =
                        totalActions === 1
                            ? 225
                            : startAngle + (index * (endAngle - startAngle)) / (totalActions - 1);
                    const angleRad = (angleDeg * Math.PI) / 180;

                    // X og Y forskyvning fra senter av pluss-knappen
                    const x = Math.round(radius * Math.cos(angleRad));
                    const y = Math.round(radius * Math.sin(angleRad));

                    const style = {
                        width: `${buttonSize}px`,
                        height: `${buttonSize}px`,
                        transform: isOpen
                            ? `translate(${x}px, ${y}px) scale(1)`
                            : 'translate(0px, 0px) scale(0)',
                        transitionDelay: isOpen ? `${index * 0.04}s` : '0s',
                    };

                    return (
                        <Link
                            key={action.id}
                            href={action.href}
                            className={styles.fabAction}
                            style={style}
                            onClick={closeFab}
                            aria-label={action.label}
                        >
                        {action.icon}
                        </Link>
                    );
                })}
            </div>

        {/* Hovedknapp */}
            <button type="button" className={styles.fabMain} onClick={toggleFab} aria-label="Meny">
                <div className={`${styles.fabIconPlus} ${isOpen ? styles.active : ''}`}>
                    <Plus size={28} />
                </div>
                <div className={`${styles.fabIconClose} ${isOpen ? styles.active : ''}`}>
                    <X size={28} />
                </div>
            </button>
        </div>
    </>
  );
}