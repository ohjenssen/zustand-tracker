import { create } from 'zustand'

export const useUserStore = create((set, get) => ({
  name: '',
  email: '',
  age: 0,
  dailyCalories: 0,
  loading: false,

  fetchUser: async () => {
    if (get().name) return; // Hvis vi allerede har dataen, ikke hent den på nytt
    set({ loading: true });
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
    } catch (err) {
        console.error("Error", err);
    }
}
}));

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    meals: null,
    foodProducts: null,
    foodProductsByName: null,

    setUser: (user) => set({ user }),
    setAuth: (token) => set({ token }),

    logout: async () => {
        const token = get().token || localStorage.getItem('token');

        if (token) {
            try {
                await fetch('https://foodtracker-api.oskarjenssen.com/api/logout', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Feil ved utlogging på server:', error);
            }
        }

        localStorage.removeItem('token');
        set({ user: null, token: null, meals: null, isLoading: false });
    },

    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token });
    },

    checkAuth: async () => {
        set({ isLoading: true });
        const token = localStorage.getItem('token');
        const user = get().user;

        if (user && token) {
            set({ isLoading: false });
            return true;
        }

        if (token) {
            try {
                const res = await fetch('https://foodtracker-api.oskarjenssen.com/api/user', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const userData = await res.json();
                    set({ user: userData, token, isLoading: false });
                    return true;
                } else {
                    localStorage.removeItem('token');
                    set({ user: null, token: null, isLoading: false });
                    return false;
                }
            } catch (error) {
                console.error('Feil ved validering av token:', error);
                set({ user: null, token: null, isLoading: false });
                return false;
            }
        } else {
            set({ user: null, token: null, isLoading: false });
            return false;
        }
    },

    getMeals: async () => {
        const token = get().token || localStorage.getItem('token');

        if (!token) return;

        try {
            const response = await fetch('https://foodtracker-api.oskarjenssen.com/api/meals', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                const mealsData = json.data ? json.data : json;
                set({ meals: mealsData });
            }
        } catch (error) {
            console.error('Feil ved henting av måltider:', error);
        }
    },

    getSingleMeal: async (id) => {
        const token = get().token || localStorage.getItem('token');

        if (!token) return;

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/meals/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            const json = await response.json();
            return json;
        } catch (error) {
            console.error('Feil ved henting av måltider:', error);
        }
    },

    getFoodProducts: async () => {
        const token = get().token || localStorage.getItem('token');

        if(!token) return;

        try {
            const response = await fetch('https://foodtracker-api.oskarjenssen.com/api/food-products', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                const foodProducts = json.data ? json.data : json;
                set({ foodProducts: foodProducts });
            }
        } catch (error) {
            console.error('Feil ved henting av måltider:', error);
        }
    },

    getFoodProductsByName: async (searchQuery) => {
        const token = get().token || localStorage.getItem('token');

        if(!token) return;

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/food-products?name=${searchQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                const foodProductsByName = json.data ? json.data : json;
                set({ foodProductsByName: foodProductsByName });
            }
        } catch (error) {
            console.error('Feil ved henting av måltider:', error);
        }
    },

    createNewMeal: async (mealObject) => {
        const token = get().token || localStorage.getItem('token');
        const getMeals = get().getMeals;
        if(!token) return;

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/meals`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(mealObject)
            });
            const json = await response.json();
            getMeals();
            return json.id;
        } catch(error) {
            console.error(error)
        }
    },

    updateMeal: async (mealId, mealObject) => {
        const token = get().token || localStorage.getItem('token');
        
        if(!token) return;
        
        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/meals/${mealId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(mealObject)
            });
            const json = await response.json();
            return json.id;
        } catch(error) {
            console.error(error)
        }
    },

    deleteMeal: async (mealId) => {
        const token = get().token || localStorage.getItem('token');
        const getMeals = get().getMeals;

        if(!token) return;

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/meals/${mealId}`, { 
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok){
                getMeals();
            }
        } catch(error) { 
            console.error('error')
        }
    }
}));