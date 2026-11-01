"use client";
import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import styles from "./rulerSlider.module.css";

export default function RulerSlider({ 
    value = 100, 
    onChange, 
    min = 0, 
    max = 1000, 
    step = 1, 
    unit = "g" 
}) {
    const containerRef = useRef(null);
    const stepWidth = 10; // Pikselbredde per tall-steg
    const totalSteps = Math.floor((max - min) / step);

    // Motion value for X-posisjonen til linjalen
    const x = useMotionValue(0);

    // Siste verdi linjalen selv sendte ut. Brukes for å skille egne endringer
    // fra endringer utenfra (f.eks. at brukeren skriver i tallfeltet).
    const lastEmittedValue = useRef(null);

    // Flytt linjalen når verdien endres utenfra (og ved første lasting)
    useEffect(() => {
        if (value === lastEmittedValue.current) return;
        x.stop(); // Avbryt eventuell glide-animasjon
        const currentStep = (value - min) / step;
        x.set(-currentStep * stepWidth);
    }, [value, min, step, x]);

    // Lytter på selve posisjonen i stedet for onDrag, slik at verdien
    // også oppdateres mens linjalen glir videre etter at man har sluppet
    useMotionValueEvent(x, "change", (currentX) => {
        // Beregn nåværende steg basert på negativ offset
        const rawStep = -currentX / stepWidth;
        const calculatedValue = Math.round(rawStep) * step + min;

        const clampedValue = Math.max(min, Math.min(max, calculatedValue));
        if (clampedValue !== value) {
            lastEmittedValue.current = clampedValue;
            onChange(clampedValue);
        }
    });

    return (
        <div className={styles.wrapper}>
            {/* Tall-visning i toppen */}
            <div className={styles.displayContainer}>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val)) {
                            const clamped = Math.min(max, Math.max(min, val));
                            lastEmittedValue.current = null; // Skrevet inn manuelt: linjalen skal følge etter
                            onChange(clamped);
                        }
                    }}
                    className={styles.valueInput}
                />
                <span className={styles.unit}>{unit}</span>
            </div>

            {/* Linjal-beholder */}
            <div className={styles.rulerContainer} ref={containerRef}>
                {/* Midt-indikator */}
                <div className={styles.centerIndicator} />

                {/* Draggbar linjal med Framer Motion */}
                <motion.div
                    className={styles.ticksTrack}
                    drag="x"
                    dragConstraints={{
                        left: -totalSteps * stepWidth,
                        right: 0
                    }}
                    dragElastic={0.05}
                    dragTransition={{
                        bounceStiffness: 300,
                        bounceDamping: 30,
                        // Glir alltid til nærmeste strek, så tallet og streken under indikatoren stemmer
                        modifyTarget: (target) => Math.round(target / stepWidth) * stepWidth,
                    }}
                    style={{ x }}
                >
                    <div className={styles.ticksWrapper}>
                        {Array.from({ length: totalSteps + 1 }).map((_, index) => {
                            const currentValue = min + index * step;
                            const isMajor = currentValue % 10 === 0;
                            const isMedium = currentValue % 5 === 0 && !isMajor;

                            return (
                                <div 
                                    key={index} 
                                    className={styles.tickGroup}
                                    style={{ width: `${stepWidth}px` }}
                                >
                                    <div 
                                        className={`
                                            ${styles.tick} 
                                            ${isMajor ? styles.majorTick : ''} 
                                            ${isMedium ? styles.mediumTick : ''}
                                        `} 
                                    />
                                    {isMajor && (
                                        <span className={styles.tickLabel}>
                                            {currentValue}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}