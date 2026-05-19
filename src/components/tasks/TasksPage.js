import React, { useState, useEffect, useCallback } from "react";
import { taskService } from "../../services/taskService";
import { userService } from "../../services/userService";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import TaskForm from "./TaskForm";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCheckSquare, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const STATUS_FILTERS = ["ALL", "TODO", "IN_PROGRESS", "DONE"];
const PAGE_SIZE = 10;

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [modal, setModal] = useState({ open: false, task: null });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [result, u] = await Promise.all([
        taskService.getAll({ page, size: PAGE_SIZE, q: debouncedSearch, status: statusFilter, priority: priorityFilter }),
        users.length === 0 ? userService.getAll() : Promise.resolve(users),
      ]);
      setTasks(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      if (users.length === 0) setUsers(u);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, priorityFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  function handleStatusFilter(s) {
    setStatusFilter(s);
    setPage(0);
  }

  function handlePriorityFilter(p) {
    setPriorityFilter(priorityFilter === p ? "ALL" : p);
    setPage(0);
  }

  async function handleSave(data) {
    if (modal.task) {
      await taskService.update(modal.task.id, data);
      toast.success("Task updated");
    } else {
      await taskService.create(data);
      toast.success("Task created");
    }
    setModal({ open: false, task: null });
    load();
  }

  async function handleDelete(id) {
    await taskService.delete(id);
    setDeleteId(null);
    toast.success("Task deleted");
    if (tasks.length === 1 && page > 0) setPage(p => p - 1);
    else load();
  }

  async function toggleStatus(task) {
    const next = task.status === "TODO" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "DONE" : "TODO";
    await taskService.update(task.id, { ...task, status: next });
    toast.success(`Task marked as ${next.replace("_", " ")}`);
    load();
  }

  function getUserName(id) {
    return users.find(u => u.id === id)?.name || "Unassigned";
  }

  function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
  }

  const CheckBox = ({ task }) => (
    <button
      onClick={() => toggleStatus(task)}
      className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.status === "DONE" ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-blue-500"}`}
    >
      {task.status === "DONE" && <svg viewBox="0 0 12 12" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
    </button>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalElements} total tasks</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setModal({ open: true, task: null })}>
          Create Task
        </Button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { label: "To Do", key: "TODO", color: "text-slate-700 bg-slate-50 border-slate-100" },
          { label: "In Progress", key: "IN_PROGRESS", color: "text-blue-700 bg-blue-50 border-blue-100" },
          { label: "Done", key: "DONE", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
        ].map(({ label, key, color }) => (
          <button
            key={key}
            onClick={() => handleStatusFilter(statusFilter === key ? "ALL" : key)}
            className={`rounded-xl border p-3 md:p-4 text-left transition-all ${color} ${statusFilter === key ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
          >
            <p className="text-xl md:text-2xl font-bold">—</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      <Card>
        {/* Filters */}
        <div className="p-3 md:p-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="relative">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
              >
                {s === "ALL" ? "All" : s === "IN_PROGRESS" ? "In Progress" : s === "TODO" ? "To Do" : "Done"}
              </button>
            ))}
            {["HIGH", "MEDIUM", "LOW"].map(p => (
              <button
                key={p}
                onClick={() => handlePriorityFilter(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${priorityFilter === p ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FiCheckSquare size={40} className="mb-3 opacity-30" />
            <p className="font-medium">No tasks found</p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-gray-100">
              {tasks.map(task => (
                <div key={task.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <CheckBox task={task} />
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${task.status === "DONE" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setModal({ open: true, task })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(task.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pl-7">
                    <Badge value={task.priority} />
                    <Badge value={task.status} />
                    <span className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) && task.status !== "DONE" ? "text-red-500" : "text-gray-400"}`}>
                      <FiCalendar size={11} />{task.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 pl-7">Assigned: {getUserName(task.assignedTo)}</p>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Task", "Priority", "Status", "Due Date", "Assigned To", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <CheckBox task={task} />
                          <div>
                            <p className={`text-sm font-semibold ${task.status === "DONE" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge value={task.priority} /></td>
                      <td className="px-4 py-3"><Badge value={task.status} /></td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) && task.status !== "DONE" ? "text-red-500" : "text-gray-500"}`}>
                          <FiCalendar size={12} />{task.dueDate}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{getUserName(task.assignedTo)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setModal({ open: true, task })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteId(task.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {page + 1} of {totalPages} &nbsp;·&nbsp; {totalElements} tasks
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === i ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {totalPages <= 1 && tasks.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {tasks.length} of {totalElements} tasks
          </div>
        )}
      </Card>

      <Modal open={modal.open} onClose={() => setModal({ open: false, task: null })} title={modal.task ? "Edit Task" : "Create Task"}>
        <TaskForm task={modal.task} users={users} onSave={handleSave} onCancel={() => setModal({ open: false, task: null })} />
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task" size="sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this task?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>Delete Task</Button>
        </div>
      </Modal>
    </div>
  );
}
