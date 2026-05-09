"use client";
import { useState } from 'react';
import Navbar from '../components/Navbar';
import UserProfile from '../components/UserProfile';
import UserSettings from '../components/UserSettings';

export default function ProfilePage() {
  // Foreløpig lokal data, snart fra global state!
  const [userData, setUserData] = useState({
    name: "Oskar Heming Jenssen",
    email: "oskar_jenssen@hotmail.com",
    age: 29,
    dailyCalories: 2200
  });

  // State for å kontrollere om vi er i redigeringsmodus
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="min-h-screen bg-[#003d2b] text-white relative pb-24">
      
      {/* Alltid vis profilvisningen */}
      <UserProfile 
        userData={userData} 
        onEdit={() => setIsEditing(true)} 
      />

      {/* Vis redigering som overlay hvis isEditing er true */}
      {isEditing && (
        <UserSettings 
          currentData={userData} 
          onClose={() => setIsEditing(false)}
          onSave={setUserData} // Oppdaterer dataene her midlertidig
        />
      )}

      <Navbar />
    </main>
  );
}