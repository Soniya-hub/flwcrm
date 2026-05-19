import React from "react";

const styles = {
  NEW: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  CONTACTED: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  CLOSED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  HIGH: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  MEDIUM: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  LOW: "bg-slate-50 text-slate-600 ring-1 ring-slate-500/20",
  TODO: "bg-slate-50 text-slate-600 ring-1 ring-slate-500/20",
  IN_PROGRESS: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  DONE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  INACTIVE: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  ADMIN: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20",
  USER: "bg-slate-50 text-slate-600 ring-1 ring-slate-500/20",
};

const labels = {
  IN_PROGRESS: "In Progress",
  TODO: "To Do",
};

export default function Badge({ value }) {
  const cls = styles[value] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {labels[value] || value}
    </span>
  );
}
