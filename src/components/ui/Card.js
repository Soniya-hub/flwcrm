import React from "react";

export default function Card({ children, className = "", hover = false }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200/60 shadow-sm ${hover ? "hover:shadow-md transition-shadow" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, icon, trend, trendLabel, color = "blue" }) {
  const colors = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600" },
    green: { bg: "bg-emerald-50", icon: "text-emerald-600" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600" },
  };
  const c = colors[color];
  const isPositive = trend > 0;

  return (
    <Card hover>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${c.bg}`}>
            <span className={`text-xl ${c.icon}`}>{icon}</span>
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
              {isPositive ? "+" : ""}{trend}%
            </span>
            <span className="text-xs text-gray-500">{trendLabel}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
