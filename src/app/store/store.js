import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    meals: null,
    foodProducts: null,
    foodProductsByName: null,
    savedMeals: null,

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
        set({ user: null, token: null, meals: null, savedMeals: null, isLoading: false });
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
    },

    // ---------- Lagrede måltider ----------

    getSavedMeals: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('https://foodtracker-api.oskarjenssen.com/api/saved-meals', {
                headers: {
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                set({ savedMeals: json.data ? json.data : json });
            }
        } catch (error) {
            console.error('Feil ved henting av lagrede måltider:', error);
        }
    },

    // products: [{ id, grams }]
    createSavedMeal: async (name, products) => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return false;

        try {
            const response = await fetch('https://foodtracker-api.oskarjenssen.com/api/saved-meals', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, products })
            });

            if (response.ok) {
                get().getSavedMeals();
                return true;
            }
            console.error('Kunne ikke lagre måltid:', await response.json());
            return false;
        } catch (error) {
            console.error('Feil ved lagring av måltid:', error);
            return false;
        }
    },

    // Legger et lagret måltid inn i dagboken. Returnerer id-en til det nye måltidet.
    logSavedMeal: async (savedMealId, date) => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/saved-meals/${savedMealId}/log`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(date ? { date } : {})
            });

            if (!response.ok) return null;

            const json = await response.json();
            await get().getMeals();
            return json.data ? json.data.id : json.id;
        } catch (error) {
            console.error('Feil ved logging av lagret måltid:', error);
            return null;
        }
    },

    deleteSavedMeal: async (savedMealId) => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        // Fjern kortet med en gang, så føles det raskt
        set({ savedMeals: (get().savedMeals || []).filter((m) => m.id !== savedMealId) });

        try {
            const response = await fetch(`https://foodtracker-api.oskarjenssen.com/api/saved-meals/${savedMealId}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) get().getSavedMeals();
        } catch (error) {
            console.error('Feil ved sletting av lagret måltid:', error);
            get().getSavedMeals();
        }
    }
}));
