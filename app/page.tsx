"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("books").select("*").order("id", { ascending: true });
      if (limit > 0) {
        query = query.limit(limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Books Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 dark:bg-zinc-800">
          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="limit" className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                조회 건수 (Fetch Count)
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              >
                <option value={5}>5 건</option>
                <option value={10}>10 건</option>
                <option value={0}>전체 (All)</option>
              </select>
            </div>
            
            <button
              onClick={fetchBooks}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "조회 중..." : "데이터 조회"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
              Error: {error}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300">
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">ID</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">ISBN</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">Title</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">Author</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">Publisher</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">Price</th>
                  <th className="py-3 px-4 border-b dark:border-zinc-700 font-medium text-sm">Stock</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm">{book.id}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm text-gray-500 dark:text-zinc-400">{book.isbn}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm font-medium">{book.title}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm">{book.author}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm text-gray-500 dark:text-zinc-400">{book.publisher || '-'}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm">${book.price}</td>
                      <td className="py-3 px-4 border-b dark:border-zinc-700 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.stock_quantity > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {book.stock_quantity}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-zinc-500">
                      {loading ? "데이터를 불러오는 중입니다..." : "조회된 데이터가 없습니다. (No data fetched)"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
