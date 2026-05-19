import React, { useState, useEffect } from "react";
import { userService } from "../../services/userService";
import { leadService } from "../../services/leadService";
import { taskService } from "../../services/taskService";
import { MOCK_ACTIVITY } from "../../data/mockData";
import Card, { StatCard } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input, { Select } from "../ui/Input";
import toast from "react-hot-toast";
import { FiUsers, FiTarget, FiCheckSquare, FiActivity, FiPlus, FiEdit2, FiTrash2, FiShield, FiClock } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_DATA } from "../../data/mockData";

const TABS = ["Overview", "Users", "Activity Logs"];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModal, setUserModal] = useState({ open: false, user: null });
  const [deleteId, setDeleteId] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "USER", status: "ACTIVE" });

  async function load() {
    const [u, l, t] = await Promise.all([userService.getAll(), leadService.getAll(), taskService.getAll()]);
    setUsers(u);
    setLeads(l);
    setTasks(t);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openUserModal(user = null) {
    setUserForm(user ? { name: user.name, email: user.email, role: user.role, status: user.status } : { name: "", email: "", role: "USER", status: "ACTIVE" });
    setUserModal({ open: true, user });
  }

  async function handleUserSave(e) {
    e.preventDefault();
    if (userModal.user) {
      await userService.update(userModal.user.id, userForm);
      toast.success("User updated");
    } else {
      await userService.create(userForm);
      toast.success("User created");
    }
    setUserModal({ open: false, user: null });
    load();
  }

  async function handleDeleteUser(id) {
    await userService.delete(id);
    setDeleteId(null);
    toast.success("User removed");
    load();
  }

  const analyticsData = CHART_DATA.revenueMonthly.slice(-6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage users, monitor analytics, and review activity logs.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
          <FiShield size={14} className="text-purple-600" />
          <span className="text-xs font-medium text-purple-700">Admin Access</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={loading ? "—" : users.length} icon={<FiUsers />} trend={8.1} trendLabel="this month" color="blue" />
            <StatCard title="Total Leads" value={loading ? "—" : leads.length} icon={<FiTarget />} trend={12.5} trendLabel="this month" color="green" />
            <StatCard title="Active Tasks" value={loading ? "—" : tasks.filter(t => t.status !== "DONE").length} icon={<FiCheckSquare />} trend={-3.2} trendLabel="this month" color="amber" />
            <StatCard title="Closed Leads" value={loading ? "—" : leads.filter(l => l.status === "CLOSED").length} icon={<FiActivity />} trend={22.4} trendLabel="this month" color="purple" />
          </div>

          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue & Leads — Last 6 Months</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px", color: "#f8fafc", fontSize: "13px" }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leads" name="Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button icon={<FiPlus />} onClick={() => openUserModal()}>Add User</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3"><Badge value={user.role} /></td>
                        <td className="px-4 py-3"><Badge value={user.status} /></td>
                        <td className="px-4 py-3 text-sm text-gray-500">{user.createdAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => openUserModal(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => setDeleteId(user.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeTab === "Activity Logs" && (
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-5">System Activity Log</h3>
            <div className="space-y-3">
              {MOCK_ACTIVITY.map(item => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiClock size={11} />{item.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* User Modal */}
      <Modal
        open={userModal.open}
        onClose={() => setUserModal({ open: false, user: null })}
        title={userModal.user ? "Edit User" : "Add User"}
      >
        <form onSubmit={handleUserSave} className="space-y-4">
          <Input label="Full Name" required value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
          <Input label="Email" type="email" required value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Role" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
            <Select label="Status" value={userForm.status} onChange={e => setUserForm(f => ({ ...f, status: e.target.value }))}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={() => setUserModal({ open: false, user: null })}>Cancel</Button>
            <Button type="submit">{userModal.user ? "Update User" : "Add User"}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove User" size="sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this user?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDeleteUser(deleteId)}>Remove User</Button>
        </div>
      </Modal>
    </div>
  );
}
