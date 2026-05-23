import { create } from 'zustand'

export const useUser = create((set) => ({
  name: 'Connor Kenway',
  setName: (newValue) => set({name: newValue}),
  email: 'connor.kenway@gmail.com',
  setEmail: (newValue) => set({email: newValue}),
  age: 34,
  setAge: (newValue) => set({age: newValue}),
  dailyCalories: 2200,
  setCalories: (newValue) => set({dailyCalories: newValue}),
}))