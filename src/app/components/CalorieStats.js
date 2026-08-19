import { useAuthStore } from "../store/store";
import Spinner from "./Spinner/Spinner";

export default function CalorieStats({ eaten }) {
    const user = useAuthStore((state) => state.user);

    const proteins_in_calories = user?.gram_protein_need * 4;
    const fat_in_calories = user?.gram_fat_need * 9;
    const carbohydrates_in_calories = user?.gram_carbohydrate_need * 4;

    const dailyCalories = proteins_in_calories + fat_in_calories + carbohydrates_in_calories;

    const progressPercent = Math.min((eaten / dailyCalories) * 100, 100);

    return (
        <section className="mt-8 mb-8">
            <h2 className="text-xl font-medium mb-1 text-[#00ffb3]">Eaten</h2>
            <div className="text-2xl font-bold mb-4 text-white">
                {eaten} / <span className="text-gray-300 text-lg font-normal">{dailyCalories ? dailyCalories : <Spinner size='sm'/>} kcal</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </section>
    );
}