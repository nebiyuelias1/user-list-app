"use client";

import UserList from "./user-list";
import SearchBar from "./search-bar";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const onSearchChange = (search: string) => {
    setSearchQuery(search)
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <SearchBar onSearchChange={onSearchChange}/>
      <div className="relative flex place-items-center">
        <UserList searchQuery={searchQuery} />
      </div>
    </main>
  );
}
