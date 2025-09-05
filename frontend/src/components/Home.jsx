import React from "react";

function Home() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium mb-2">Trending Projects</h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Open Source Docs Revamp</li>
            <li>Campus Navigator App</li>
            <li>AI Study Buddy</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium mb-2">Your Teams</h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Full‑stack Guild</li>
            <li>UI/UX Collective</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-medium mb-2">Upcoming Tasks</h3>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>Design review — Friday</li>
            <li>API integration — Monday</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;


