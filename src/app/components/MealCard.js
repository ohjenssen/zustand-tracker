import Link from "next/link";
import { useAuthStore } from "../store/store";

export default function MealCard() {
    const meals = useAuthStore((state) => state.meals);
    console.log('meals: ', meals)

    if (!meals) {
        return <div className="text-[#00ffb3] text-center py-4">Henter måltider...</div>;
    }

    if (meals.length === 0) {
        return <div className="text-[#00ffb3] text-center py-4">Ingen måltider registrert ennå.</div>;
    }

    return (
        <section className="space-y-4">
            {!meals && 
                <div className="text-[#00ffb3] text-center py-4">Henter måltider...</div>
            }
            {meals.map(meal => {
                // Beregn dynamisk næring hvis måltidet har foodComponents/food_products
                const foodComponents = meal.foodComponents || [];
                
                const totals = foodComponents.reduce((acc, food) => {
                    const grams = food.gramsEaten || 0;
                    const factor = grams / 100;
                    const protein = parseFloat(food.protein || 0);
                    const fat = parseFloat(food.fat || 0);
                    const carbs = parseFloat(food.carbs || 0);
                    const kcal = food.kcal || Math.round((protein * 4) + (carbs * 4) + (fat * 9));

                    return {
                        kcal: acc.kcal + Math.round(kcal * factor),
                        protein: acc.protein + parseFloat((protein * factor).toFixed(1)),
                        fat: acc.fat + parseFloat((fat * factor).toFixed(1)),
                        carbs: acc.carbs + parseFloat((carbs * factor).toFixed(1)),
                    };
                }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });

                return (
                    <Link key={meal.id} href={`/meal/${meal.id}`} className="block transition-transform hover:scale-[1.01]">
                        <div className="bg-[#00ffb3] text-[#003d2b] rounded-2xl p-4 flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🍴</span>
                                <span className="font-bold text-lg leading-none">{meal.name || `Måltid #${meal.id}`}</span>
                            </div>
                            <div className="flex divide-x divide-[#003d2b]/20 text-center text-[10px] leading-tight font-semibold">
                                <div className="px-2 min-w-[40px]">{totals.kcal}<br/>kcal</div>
                                <div className="px-2 min-w-[40px]">{Number(totals.protein).toFixed(1)}g<br/>Prot</div>
                                <div className="px-2 min-w-[40px]">{Number(totals.fat).toFixed(1)}g<br/>Fat</div>
                                <div className="px-2 min-w-[40px]">{Number(totals.carbs).toFixed(1)}g<br/>Carbs</div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </section>
    );
}