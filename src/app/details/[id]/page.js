import { getSpecificFood } from '@/app/utils/getSpecificFood';
import DetailsClientForm from './DetailsClientForm';


export default async function DetailsPage({ params }) {
  const { id } = await params; 

  const food = await getSpecificFood(id) || { name: "Ukjent", kcal: 0, protein: 0, fat: 0, carbs: 0 };

  return (
    <main className="min-h-screen bg-[#003d2b] text-white p-6 pb-32 flex flex-col font-sans">
      <h1 className="text-3xl font-bold text-center text-[#00ffb3] mt-12 mb-16">
        {food.name} <span className="text-sm block text-white opacity-50">(Rendret på Server)</span>
      </h1>

      <DetailsClientForm food={food} />
    </main>
  );
}

