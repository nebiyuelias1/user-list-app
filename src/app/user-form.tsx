"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "./user.model";
import { time } from "console";

interface UserFormProps {
  onClose: () => void;
  onSubmitted: (user: User) => void;
}

export default function UserForm({ onClose, onSubmitted }: UserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getAllSubstrings = (str: string) => {
    const substrings = [];
    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j <= str.length; j++) {
        substrings.push(str.substring(i, j));
      }
    }
    return substrings;
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate the form
    if (!name || !email || !phone) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const newUser = {
        name,
        email,
        phone,
        searchOptions: [
          ...getAllSubstrings(name.toLowerCase()),
        ],
        timestamp: Date.now(),
      };
      const docRef = await addDoc(collection(db, "users"), newUser);
      onSubmitted({ id: docRef.id, ...newUser});
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </form>
  );
}
