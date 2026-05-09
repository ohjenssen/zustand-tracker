export default function MealCard({ name, kcal, protein, fat, carbs }) {
  return (
    <div className="bg-[#00ffb3] text-[#003d2b] rounded-2xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍴</span>
        <span className="font-bold text-lg leading-none">{name}</span>
      </div>
      <div className="flex divide-x divide-[#003d2b]/20 text-center text-[10px] leading-tight font-semibold">
        <div className="px-2">{kcal}<br/>kcal</div>
        <div className="px-2">{protein}g<br/>Prot</div>
        <div className="px-2">{fat}g<br/>Fat</div>
        <div className="px-2">{carbs}g<br/>Carbs</div>
      </div>
    </div>
  );
}