"use client";

import { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "./user.model";
import { time } from "console";

interface UserFormProps {
  onClose: () => void;
  onSubmitted: (user: User) => void;
  editingUser?: User | null;
}

export default function UserForm({ onClose, onSubmitted, editingUser }: UserFormProps) {
  const [name, setName] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [phone, setPhone] = useState(editingUser?.phone || "");

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
      let newUser = {
        name,
        email,
        phone,
        searchOptions: [
          ...getAllSubstrings(name.toLowerCase()),
        ],
        timestamp: editingUser?.timestamp || null,
      };
      let id;
      if (editingUser) {
        newUser.timestamp = editingUser.timestamp;
        await updateDoc(doc(db, "users", editingUser?.id), newUser);
        id = editingUser.id;
      } else {
        newUser.timestamp = new Date().getTime();
        const docRef = await addDoc(collection(db, "users"), newUser);
        id = docRef.id;
      }
      onSubmitted({ id, ...newUser});
    } catch (error) {
      alert(`Error when ${editingUser ? 'Updating' : 'Adding'} document: `);
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
          {editingUser ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
