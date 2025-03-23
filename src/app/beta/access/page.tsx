"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessPage() {
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Make a request to validate the access key
      const response = await fetch("/api/validate-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessKey }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        // The cookie is set by the API route
        // Redirect to the beta home page
        router.push("/beta");
        router.refresh(); // Force a refresh to apply the new cookie
      } else {
        setError("Invalid access key");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Beta Access</h1>
          <p className="text-neutral-400">Enter your access key to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="accessKey" className="sr-only">
              Access Key
            </label>
            <input
              id="accessKey"
              name="accessKey"
              type="password"
              required
              className="w-full px-4 py-3 border border-neutral-600 bg-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter access key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Beta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
