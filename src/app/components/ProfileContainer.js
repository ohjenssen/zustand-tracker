"use client";
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/store'; 
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';

export default function ProfileContainer() {
  const [isEditing, setIsEditing] = useState(false);
  
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); 
    
  }, [fetchUser]);

  return (
    <>
      <UserProfile onEdit={() => setIsEditing(true)} />

      {isEditing && (
        <UserSettings onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}

