import React from "react";
import { useAuth } from "../../contexts/AuthContext";

import { useQuery } from "@tanstack/react-query";
import { fetchOverallProgress } from "../../services/userProgressService";

import Button from "../Common/Button";

const Profile: React.FC = () => {
  const { user } = useAuth();

  const {
    data: progress,
    isLoading: isLoading,
    error: error,
  } = useQuery({
    queryKey: ["userOverallProgress", user?._id],
    queryFn: fetchOverallProgress,
    enabled: !!user,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleDelete = () => {
    return null;
    };

  return (
    <>
      <div className="bg-white rounded-md shadow-sm p-8">
        <div className="mb-8 text-center">
          <h2 className="font-bold">Your Profile</h2>
          <p className="text-gray-600 mt-2">Manage your account</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 uppercase mb-1">Name</label>
            <div className="font-medium bg-gray-50 rounded-md p-3 shadow-sm">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block uppercase mb-1">Email</label>
            <div className="font-medium bg-gray-50 rounded-md p-3 shadow-sm">
              {user.email}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-sm p-8 mt-5">
        <div className="mb-8 text-center">
          <h3 className="font-bold">Progress</h3>
        </div>
        <div className="space-y-6">
          <div>
         
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-sm p-8 mt-5">
        <div className="text-center">
          <h3 className="font-bold">Danger Zone</h3>
          <p className="text-gray-600 mt-2">Changes are non reversable</p>
        </div>
        <Button
          variant="danger"
          onClick={handleDelete}
          className="mt-3 mb-2"
          fullWidth
        >
          Delete All User Progress
        </Button>
      </div>
    </>
  );
};

export default Profile;
