"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, deleteDoc, doc, onSnapshot, where } from 'firebase/firestore';
import { db } from "../../firebase";
import { User } from "./user.model";

interface UserListProps {
    searchQuery?: string;
}

const LIMIT = 5;


export default function UserList({ searchQuery }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchItems = async () => {
    setLoading(true);
    const nextQuery = searchQuery
      ? query(
          collection(db, "users"),
          orderBy("timestamp", "desc"),
          where("searchOptions", "array-contains", searchQuery.toLowerCase()),
          limit(LIMIT + 1)
        )
      : query(
          collection(db, "users"),
          orderBy("timestamp", "desc"),
          limit(LIMIT + 1)
        );

    const querySnapshot = await getDocs(nextQuery);
    const nextUsers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];

    setUsers(nextUsers.slice(0, LIMIT));
    // Check for duplicates)
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 2]);
    setHasMore(querySnapshot.docs.length > LIMIT);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery]);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newestItem = querySnapshot.docs[0];
      if (!newestItem) return;
      setUsers((prevUsers) => {
        const isDuplicate = prevUsers.some((user) => user.id === newestItem.id);
        const newList = [...prevUsers];
        if (!isDuplicate) {
          newList.push({
            id: newestItem.id,
            ...newestItem.data(),
          } as User);
        }

        return newList;
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLoadMore = async () => {
    if (!hasMore || !lastVisible) return;

    setLoading(true);
    const nextQuery = searchQuery
      ? query(
          collection(db, "users"),
          where("searchOptions", "array-contains", searchQuery.toLowerCase()),
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(LIMIT + 1)
        )
      : query(
          collection(db, "users"),
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(LIMIT + 1)
        );

    const querySnapshot = await getDocs(nextQuery);
    const nextUsers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];

    setUsers(prevUsers => {
        // only add unique users
        const newUsers = nextUsers.slice(0, LIMIT).filter((user) => !prevUsers.some((u) => u.id === user.id));
        return [...prevUsers, ...newUsers];
    });
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 2]);
    setHasMore(querySnapshot.docs.length > LIMIT);
    setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      alert('Error deleting user!');
    }
  };

  return (
      <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`${
                index % 2 == 0
                  ? "bg-white hover:bg-gray-200"
                  : "bg-gray-100 hover:bg-gray-100"
              }`}
            >
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">
                <button 
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="text-center">Loading...</div>}
      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Load More
        </button>
      )}
    </div>
  );
}
