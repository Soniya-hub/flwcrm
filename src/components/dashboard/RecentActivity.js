import React from "react";
import Card from "../ui/Card";
import { FiTarget, FiCheckSquare, FiUsers, FiClock } from "react-icons/fi";

const typeConfig = {
  lead: { icon: FiTarget, bg: "bg-blue-50", text: "text-blue-600" },
  task: { icon: FiCheckSquare, bg: "bg-amber-50", text: "text-amber-600" },
  user: { icon: FiUsers, bg: "bg-emerald-50", text: "text-emerald-600" },
};

export default function RecentActivity({ activities }) {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500 mt-0.5">Latest updates across the team</p>
          </div>
        </div>
        <div className="space-y-4">
          {activities.map(item => {
            const cfg = typeConfig[item.type] || typeConfig.lead;
            const Icon = cfg.icon;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={14} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                  <FiClock size={11} />
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
