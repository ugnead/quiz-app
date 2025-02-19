// Profile.tsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";


const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-md">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <div className="flex items-center gap-4">
        <img
          src={user.picture || "/images/default-avatar.webp"}
          alt={`${user.name}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <p className="font-medium">Name: {user.name}</p>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
