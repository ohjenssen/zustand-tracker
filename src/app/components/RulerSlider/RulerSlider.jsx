"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./rulerSlider.module.css";

export default function RulerSlider({ 
    value = 100, 
    onChange, 
    min = 0, 
    max = 1000, 
    step = 1, 
    unit = "g" 
}) {
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    
    // Bredde per tick (strek) i piksler
    const stepWidth = 10; 
    const totalSteps = Math.floor((max - min) / step);

    // Synkroniser scroll-posisjon med "value" prop når komponenten laster eller endres utenfra
    useEffect(() => {
        if (scrollRef.current && !isDragging.current) {
            const currentStep = (value - min) / step;
            scrollRef.current.scrollLeft = currentStep * stepWidth;
        }
    }, [value, min, step]);

    // Håndter scrolling i linjalen
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const currentScroll = scrollRef.current.scrollLeft;
        const rawStep = currentScroll / stepWidth;
        const calculatedValue = Math.round(rawStep) * step + min;
        
        const clampedValue = Math.max(min, Math.min(max, calculatedValue));
        if (clampedValue !== value) {
            onChange(clampedValue);
        }
    };

    // Drag-funksjonalitet for mus (for desktop-testing)
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };

    const handleMouseLeaveOrUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Hastighet på drag
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <div className={styles.wrapper}>
            {/* Hovedvisning av tall og enhet */}
            <div className={styles.displayContainer}>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
                    }}
                    className={styles.valueInput}
                />
                <span className={styles.unit}>{unit}</span>
            </div>

            {/* Linjal-beholder */}
            <div className={styles.rulerContainer}>
                {/* Den grønne markøren i midten */}
                <div className={styles.centerIndicator} />

                {/* Scrollefeltet for linjalen */}
                <div
                    ref={scrollRef}
                    className={styles.rulerScroll}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                >
                    {/* Padding-blokker for at 0 og MAX skal kunne nå midten av skjermen */}
                    <div className={styles.paddingBlock} />

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

                    <div className={styles.paddingBlock} />
                </div>
            </div>
        </div>
    );
}