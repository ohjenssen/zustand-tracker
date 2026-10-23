"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./addProduct.module.css";
import { useAuthStore } from "../store/store";
import BackButton from "../components/BackButton/BackButton";
import { ScanBarcode } from "lucide-react";
import Spinner from "../components/Spinner/Spinner";

function AddProductContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const barcodeParam = searchParams.get("barcode") || "";
	const mealIdParam = searchParams.get("mealId");
	const dateParam = searchParams.get("date");
	const token = useAuthStore((state) => state.token);

	const [formData, setFormData] = useState({
		name: "",
		variant: "",
		brand: "",
		proteins: "",
		fat: "",
		carbohydrates: "",
		barcode: barcodeParam,
	});

	// Kun for testing: fyller skjemaet med et oppdiktet produkt
	const fillTestProduct = () => {
		setFormData((prev) => ({
			...prev,
			name: "Nudler",
			variant: "Regnbue-enhjørning",
			brand: "Testmerke",
			proteins: "9.5",
			fat: "14",
			carbohydrates: "62",
		}));
	};

	// Sørg for at barcode oppdateres i formData dersom den finnes i URL
	useEffect(() => {
		if (barcodeParam) {
			setFormData((prev) => ({ ...prev, barcode: barcodeParam }));
		}
	}, [barcodeParam]);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Tallfeltene lagres som tekst mens man skriver, og gjøres om til tall ved lagring
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const payload = {
			...formData,
			proteins: parseFloat(formData.proteins) || 0,
			fat: parseFloat(formData.fat) || 0,
			carbohydrates: parseFloat(formData.carbohydrates) || 0,
		};

		console.log("Data som sendes:", JSON.stringify(payload));

		try {
			const res = await fetch(
				"https://foodtracker-api.oskarjenssen.com/api/food-product",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				},
			);

			const newProduct = await res.json();
			console.log("Respons fra server:", newProduct);

			if (res.ok) {
				// Send brukeren rett videre til gram-siden for det nye produktet
				const params = new URLSearchParams();
				if (mealIdParam && mealIdParam !== "null") params.set("mealId", mealIdParam);
				if (dateParam && dateParam !== "null") params.set("date", dateParam);
				router.push(`/details/${newProduct.id}?${params.toString()}`);
			} else {
				alert(
					"Kunne ikke lagre matvaren. Sjekk konsollen for valideringsfeil.",
				);
			}
		} catch (err) {
			console.error("Feil ved lagring:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<BackButton />
			<header className={styles.header}>
				<h1 className={styles.title}>Legg til ny matvare</h1>
				<div className={styles.barcodeContainer}>
					<ScanBarcode />
					<label>{formData.barcode}</label>
				</div>
			</header>

			{process.env.NODE_ENV !== "production" && (
				<button
					type="button"
					onClick={fillTestProduct}
					className={styles.testFillButton}
					>
					Fyll inn testprodukt
				</button>
			)}

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.textInputsGroup}>

					<div className={styles.inlineInputRow}>
						<label htmlFor="name" className={styles.label}>
							Matvare:
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className={styles.underlineInput}
							required
							placeholder="f.eks Nudler"
						/>
					</div>

					<div className={styles.inlineInputRow}>
						<label htmlFor="variant" className={styles.label}>
							Variant:
						</label>
						<input
							type="text"
							id="variant"
							name="variant"
							value={formData.variant}
							onChange={handleChange}
							className={styles.underlineInput}
							placeholder="f.eks Kylling"
							required
						/>
					</div>

					<div className={styles.inlineInputRow}>
						<label htmlFor="brand" className={styles.label}>
							Merke:
						</label>
						<input
							type="text"
							id="brand"
							name="brand"
							value={formData.brand}
							onChange={handleChange}
							className={styles.underlineInput}
							placeholder="f.eks Rema 1000"
							required
						/>
					</div>
				</div>

				<div className={styles.nutritionInputsGroup}>

					<div className={styles.nutritionRow}>
						<label htmlFor="fat" className={styles.nutritionLabel}>
							Fats
						</label>
						<input
							type="number"
							id="fat"
							name="fat"
							value={formData.fat}
							min="0"
							step="0.1"
							onChange={handleChange}
							className={styles.nutritionInput}
							placeholder="f.eks  20"
							required
						/>
					</div>

					<div className={styles.nutritionRow}>
						<label htmlFor="carbohydrates" className={styles.nutritionLabel}>
							Carbohydrates
						</label>
						<input
							type="number"
							id="carbohydrates"
							name="carbohydrates"
							value={formData.carbohydrates}
							min="0"
							step="0.1"
							onChange={handleChange}
							className={styles.nutritionInput}
							placeholder="f.eks 55"
							required
						/>
					</div>

					<div className={styles.nutritionRow}>
						<label htmlFor="proteins" className={styles.nutritionLabel}>
							Proteins
						</label>
						<input
							type="number"
							id="proteins"
							name="proteins"
							value={formData.proteins}
							min="0"
							step="0.1"
							onChange={handleChange}
							className={styles.nutritionInput}
							placeholder="f.eks 13"
							required
						/>
					</div>
				</div>

				<div className={styles.buttonWrapper}>
					<button
						type="submit"
						disabled={isSubmitting}
						className={styles.saveButton}
					>
						{isSubmitting ? "Lagrer..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default function AddProductPage() {
	return (
		<Suspense fallback={<div className={styles.loadingContainer}><Spinner /></div>}>
			<AddProductContent />
		</Suspense>
	);
}
