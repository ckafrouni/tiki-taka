"use client";

import { cognitiveDiversity } from "~/config/persona.json";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Choose your task</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(cognitiveDiversity).map((taskName) => (
            <Link key={taskName} href={`/${taskName}`} className="block">
              <button className="w-full p-4 text-left bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
                {/* replace camelcase with readable shit */}
                <h2 className="text-lg font-semibold capitalize">
                  {taskName.replace(/([A-Z])/g, " $1").trim()}
                </h2>
              </button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
