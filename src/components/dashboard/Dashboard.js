import React, { useState, useEffect } from "react";
import { StatCard } from "../ui/Card";
import { FiTarget, FiCheckSquare, FiUsers, FiDollarSign, FiActivity } from "react-icons/fi";
import { leadService } from "../../services/leadService";
import { taskService } from "../../services/taskService";
import { userService } from "../../services/userService";
import { MOCK_ACTIVITY, CHART_DATA } from "../../data/mockData";
import RevenueChart from "./RevenueChart";
import LeadStatusChart from "./LeadStatusChart";
import RecentActivity from "./RecentActivity";

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, tasks: 0, clients: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [leads, tasks, users] = await Promise.all([
        leadService.getAll(),
        taskService.getAll(),
        userService.getAll(),
      ]);
      setStats({
        leads: leads.totalElements,
        tasks: tasks.content.filter(t => t.status !== "DONE").length,
        clients: users.length,
        revenue: 102000,
      });
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { title: "Total Leads", value: loading ? "—" : stats.leads, icon: <FiTarget />, trend: 12.5, trendLabel: "vs last month", color: "blue" },
    { title: "Active Tasks", value: loading ? "—" : stats.tasks, icon: <FiCheckSquare />, trend: -3.2, trendLabel: "vs last month", color: "amber" },
    { title: "Total Clients", value: loading ? "—" : stats.clients, icon: <FiUsers />, trend: 8.1, trendLabel: "vs last month", color: "green" },
    { title: "Revenue (MTD)", value: loading ? "—" : `$${(stats.revenue / 1000).toFixed(0)}K`, icon: <FiDollarSign />, trend: 18.4, trendLabel: "vs last month", color: "purple" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RevenueChart data={CHART_DATA.revenueMonthly} />
        </div>
        <div>
          <LeadStatusChart data={CHART_DATA.leadStatus} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentActivity activities={MOCK_ACTIVITY} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiActivity className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-900 text-sm">Lead Pipeline</h3>
          </div>
          {[
            { label: "New", value: 35, color: "bg-blue-500" },
            { label: "Contacted", value: 45, color: "bg-amber-500" },
            { label: "Closed", value: 20, color: "bg-emerald-500" },
          ].map(item => (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.value}%`, transition: "width 1s ease" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
