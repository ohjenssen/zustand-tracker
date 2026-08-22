"use client";
import { useState } from 'react';
import UserProfile from './UserProfile/UserProfile';
import UserSettings from './UserSettings/UserSettings';

export default function ProfileContainer() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <UserProfile onEdit={() => setIsEditing(true)} />

      {isEditing && (
        <UserSettings onClose={() => setIsEditing(false)} />
      )}
    </>
  );
}

