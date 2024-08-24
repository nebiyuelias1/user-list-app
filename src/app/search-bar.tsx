"use client";

import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import UserForm from "./user-form";
import { User } from "./user.model";

interface SearchBarProps {
    onSearchChange: (search: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUserClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  function handleOnSubmit(user: User): void {
    setIsDialogOpen(false);
    // Show a success message
    alert("User added successfully!");
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
        <button
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={handleAddUserClick}
        >
          <FaPlus className="mr-2" />
          Add User
        </button>
        <div className="relative flex-grow ml-4">
          <input
            onChange={e => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Add User</h2>
            <UserForm
              onClose={handleCloseDialog}
              onSubmitted={handleOnSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
