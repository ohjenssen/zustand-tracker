// Summerer kcal og makroer for en liste foodComponents (verdiene er per 100 g)
export function getMealTotals(foodComponents = []) {
    return foodComponents.reduce((acc, food) => {
        const factor = (food.gramsEaten || 0) / 100;
        const protein = parseFloat(food.protein || 0);
        const fat = parseFloat(food.fat || 0);
        const carbs = parseFloat(food.carbs || 0);
        const kcal = food.kcal || Math.round((protein * 4) + (carbs * 4) + (fat * 9));

        return {
            kcal: acc.kcal + Math.round(kcal * factor),
            protein: acc.protein + protein * factor,
            fat: acc.fat + fat * factor,
            carbs: acc.carbs + carbs * factor,
        };
    }, { kcal: 0, protein: 0, fat: 0, carbs: 0 });
}
