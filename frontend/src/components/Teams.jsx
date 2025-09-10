import React from "react";

const demoTeams = [
  { name: "Full‑stack Guild", role: "Developer", members: ["Jane", "Alex", "Sam"] },
  { name: "UI/UX Collective", role: "Designer", members: ["Priya", "Liam"] },
];

function Teams() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Teams</h2>
      <div className="space-y-3">
        {demoTeams.map((t) => (
          <div key={t.name} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-gray-600 text-sm">Your role: {t.role}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm">Open</button>
            </div>
            <div className="mt-2 text-gray-700 text-sm">Members: {t.members.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;


