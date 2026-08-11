"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/app/store/store';
import styles from './detailsClientForm.module.css'

export default function DetailsClientForm({ id }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mealId = searchParams.get('mealId');
	const dateParam = searchParams.get('date');

	const [grams, setGrams] = useState(100);

	// Henter data og funksjoner direkte fra Zustand store
	const foodProducts = useAuthStore((state) => state.foodProducts);
	const getFoodProducts = useAuthStore((state) => state.getFoodProducts);
	const createNewMeal = useAuthStore((state) => state.createNewMeal);
	const updateMeal = useAuthStore((state) => state.updateMeal);
	const getSingleMeal = useAuthStore((state) => state.getSingleMeal);
	const getMeals = useAuthStore((state) => state.getMeals);

	// Henter matprodukter dersom de ikke finnes i store enda
	useEffect(() => {
		if (!foodProducts) {
			getFoodProducts();
		}
	}, [foodProducts, getFoodProducts]);

	// Viser laste-tilstand hvis foodProducts ikke er klar enda
	if (!foodProducts) {
		return <div className={styles.notFound}>Henter matvare...</div>;
	}

	// Finner riktig matprodukt basert på ID fra store
	const food = foodProducts.find((f) => String(f.id) === String(id));

	if (!food) {
		return <div className={styles.notFound}>Fant ikke matproduktet.</div>;
	}

	const numericGrams = parseFloat(grams) || 0;
	const factor = numericGrams / 100;

	// Henter ut makronæringsstoffene per 100g
	const protein = parseFloat(food.proteins || 0);
	const fat = parseFloat(food.fat || 0);
	const carbs = parseFloat(food.carbohydrates || 0);

	// Regner ut kalorier per 100g: (Protein * 4) + (Carbs * 4) + (Fat * 9)
	const kcalPer100g = (protein * 4) + (carbs * 4) + (fat * 9);
	
	// Skalerer opp til mengden gram som er tastet inn
	const calculatedKcal = Math.round(kcalPer100g * factor);

	const handleSave = async (e) => {
		e.preventDefault();

		const numericId = parseInt(id);
		const numericGrams = parseInt(grams) || 0;
		if (mealId === 'new') {
			const foodItemWithGrams = { 
				products: [
					{
						id: numericId,
						grams: numericGrams
					}
				],
				...(dateParam && { "date": dateParam })
			};

			const newMeal = await createNewMeal(foodItemWithGrams);
			if (newMeal) {
				router.push(`/meal/${newMeal}`);
			}
		} else if (mealId) {
			// Hent måltidet
			const mealResponse = await getSingleMeal(mealId);
			const mealData = mealResponse?.data || mealResponse;

			// Mapper ut eksisterende produkter til { id, grams }
			const existingProducts = (mealData?.foodComponents || []).map(p => ({
				id: p.id,
				grams: p.gramsEaten || 0
			}));

			// Filtrer ut det produktet vi legger til nå hvis det allerede fantes i måltidet
			const filteredProducts = existingProducts.filter(p => p.id !== numericId);

			//Slå sammen med den nye/oppdaterte matvaren
			const updatedProducts = [
				...filteredProducts,
				{
					id: numericId,
					grams: numericGrams
				}
			];

			const mealObject = { 
				products: updatedProducts
			};
			await updateMeal(parseInt(mealId), mealObject);
			await getMeals();
			router.push(`/meal/${mealId}`);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.titleContainer}>
				<button onClick={() => router.back()} className={styles.backButton}>
					<ChevronLeft size={32} />
				</button>

				<h1 className={styles.title}>{food.name}</h1>

				<div></div>
			</div>
		
			<div className={styles.statsContainer}>
				{[
					{ label: "Kcal", value: calculatedKcal },
					{ label: "Proteins", value: `${(protein * factor).toFixed(1)} g` },
					{ label: "Fats", value: `${(fat * factor).toFixed(1)} g` },
					{ label: "Carbohydrates", value: `${(carbs * factor).toFixed(1)} g` }
				].map(item => (
					<div key={item.label} className={styles.statRow}>
						<span className={styles.statLabel}>{item.label}</span>
						<span className={styles.statValue}>{item.value}</span>
					</div>
				))}
			</div>

			<form className={styles.actionsContainer}>
				<div className={styles.inputGroup}>
					<input 
						type="number" 
						value={grams} 
						onChange={e => setGrams(e.target.value)} 
						className={styles.gramInput}
					/>
					<span className={styles.gramUnit}>g</span>
				</div>
				<button onClick={handleSave} className={styles.saveButton}>
					Save
				</button>
			</form>
		</div>
	);
}