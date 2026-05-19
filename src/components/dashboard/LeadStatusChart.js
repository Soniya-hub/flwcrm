import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "../ui/Card";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm">
      <p className="font-medium">{payload[0].name}</p>
      <p className="text-blue-300">{payload[0].value}%</p>
    </div>
  );
}

export default function LeadStatusChart({ data }) {
  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Lead Status</h3>
        <p className="text-sm text-gray-500 mb-4">Distribution by status</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {data.map(item => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
