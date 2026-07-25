import { create } from 'zustand'
import { getUser } from '@/app/utils/getUser';
import { convertServerPatchToFullTree } from 'next/dist/client/components/segment-cache/navigation';


export const useMealsStore = create((set, get) => ({
  // Her har jeg lagd en starttilstand for måltider, 
  // dette er sånn at det ikke skal være tomt når man kommer inn på applikasjonen.
  meals: [
    { id: 1, name: "Meal 1", foodComponents: [
      { id: "1", name: "Havregryn", brand: "Coop", kcal: 363, protein: 13, fat: 6.5, carbs: 58, gramsEaten: 100 },
      { id: "3", name: "Skummetmelk", brand: "Coop", kcal: 33, protein: 3.4, fat: 0.1, carbs: 4.7, gramsEaten: 200 },
    ] },
    { id: 2, name: "Meal 2", foodComponents: [
      { id: "1", name: "Havregryn", brand: "Coop", kcal: 363, protein: 13, fat: 6.5, carbs: 58, gramsEaten: 100 }
    ] },
  ],

  // Legg til mat i eksisterende måltid
  addFoodToMeal: (mealId, foodComponent) => set((state) => {
    const factor = foodComponent.gramsEaten / 100;
    
    const calculatedComponent = {
      ...foodComponent,
      kcal: Math.round(foodComponent.kcal * factor),
      protein: Math.round((foodComponent.protein * factor) * 10) / 10,
      fat: Math.round((foodComponent.fat * factor) * 10) / 10,
      carbs: Math.round((foodComponent.carbs * factor) * 10) / 10,
    };

    return {
      meals: state.meals.map((meal) => 
        meal.id === parseInt(mealId)
          ? { ...meal, foodComponents: [...meal.foodComponents, calculatedComponent] }
          : meal
      )
    };
  }),

  // Opprett et helt nytt måltid
  createNewMeal: (foodComponent) => {
    const state = get(); // Henter nåværende tilstand inni funksjonen
    const nextId = state.meals.length > 0 ? Math.max(...state.meals.map(m => m.id)) + 1 : 1;
    
    const factor = foodComponent.gramsEaten / 100;
    const calculatedComponent = {
      ...foodComponent,
      kcal: Math.round(foodComponent.kcal * factor),
      protein: Math.round((foodComponent.protein * factor) * 10) / 10, // 12.3
      fat: Math.round((foodComponent.fat * factor) * 10) / 10,
      carbs: Math.round((foodComponent.carbs * factor) * 10) / 10,
    };

    const newMeal = {
      id: nextId,
      name: `Meal ${nextId}`,
      foodComponents: [calculatedComponent]
    };

    // Oppdaterer staten
    set({ meals: [...state.meals, newMeal] });

    // Returnerer den nye ID-en synkront til komponenten som kalte den!
    return nextId;
  }
}));

export const useUserStore = create((set, get) => ({
  name: '',
  email: '',
  age: 0,
  dailyCalories: 0,
  loading: false,

  fetchUser: async () => {
    // Hvis vi allerede har hentet dataen, ikke hent den på nytt (Caching) 
    // Sørger for at andre komponenter ikke kjører fetch på nytt
    if (get().name) return; 
    set({ loading: true });
    console.log('fetch har kjørt!')
    try {
      const res = await fetch("http://localhost:3000/api/user");
      const data = await res.json();
      
      set({
        name: data.user,
        email: data.email,
        age: data.age,
        dailyCalories: data.dailyCalories,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      console.error("Feil ved henting av bruker:", err);
    }
  },

  updateUserInDB: async (updatedFields) => {
  
  const currentFields = get();
  set(updatedFields);

  try {
    const res = await fetch("http://localhost:3000/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: updatedFields.name || currentFields.name,
        email: updatedFields.email || currentFields.email,
        age: updatedFields.age || currentFields.age,
        dailyCalories: updatedFields.dailyCalories || currentFields.dailyCalories,
      }),
    });

    if (!res.ok) throw new Error("error");
    
    console.log("Vellykket synkronisering!");
  } catch (err) {
    console.error("Error", err);
  }
}
}));

