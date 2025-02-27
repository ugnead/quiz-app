import React from "react";
import { useAuth } from "../../contexts/AuthContext";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOverallProgress, deleteOverallProgress  } from "../../services/userProgressService";

import Button from "../Common/Button";
import ProgressBar from "../Common/ProgressBar";

import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: progress,
    isLoading: isLoading,
    error: error,
  } = useQuery({
    queryKey: ["progress", user?._id],
    queryFn: fetchOverallProgress,
    enabled: !!user,
  });

  if (isLoading) {
    return null;
  }

  if (error) {
     return toast.error("Error loading data");
  }

  const handleDelete = async () => {
    try {
      await deleteOverallProgress();
      toast.success("User progress deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    } catch (error) {
      toast.error("Failed to delete user progress");
    }
  };

  const noProgress = progress.learnedQuestions === 0 && progress.passedTests === 0;

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
              {user?.name}
            </div>
          </div>
          <div>
            <label className="block uppercase mb-1">Email</label>
            <div className="font-medium bg-gray-50 rounded-md p-3 shadow-sm">
              {user?.email}
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
            <label className="block text-gray-600 uppercase mb-1">
              Answered Questions
            </label>
            <div className="font-medium">
              {progress.learnedQuestions} / {progress.totalQuestions}
              <ProgressBar
                progress={
                  progress.totalQuestions > 0
                    ? (progress.learnedQuestions / progress.totalQuestions) *
                      100
                    : 0
                }
                fillColor="bg-green-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 uppercase mb-1">
              Passed Tests
            </label>
            <div className="font-medium">
              {progress.passedTests} / {progress.totalTests}
              <ProgressBar
                progress={
                  progress.totalTests > 0
                    ? (progress.passedTests / progress.totalTests) *
                      100
                    : 0
                }
                fillColor="bg-blue-200"
              />
            </div>
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
          disabled={noProgress}
        >
          Delete All User Progress
        </Button>
      </div>
    </>
  );
};

export default Profile;
