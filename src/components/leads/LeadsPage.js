import React, { useState, useEffect, useCallback } from "react";
import { leadService } from "../../services/leadService";
import { userService } from "../../services/userService";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import LeadForm from "./LeadForm";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiTarget, FiMail, FiPhone, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const STATUS_FILTERS = ["ALL", "NEW", "CONTACTED", "CLOSED"];
const PAGE_SIZE = 10;

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [modal, setModal] = useState({ open: false, lead: null });
  const [deleteId, setDeleteId] = useState(null);

  // Debounce search input
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
        leadService.getAll({ page, size: PAGE_SIZE, q: debouncedSearch, status: statusFilter }),
        users.length === 0 ? userService.getAll() : Promise.resolve(users),
      ]);
      setLeads(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      if (users.length === 0) setUsers(u);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  function handleStatusFilter(s) {
    setStatusFilter(s);
    setPage(0);
  }

  async function handleSave(data) {
    if (modal.lead) {
      await leadService.update(modal.lead.id, data);
      toast.success("Lead updated");
    } else {
      await leadService.create(data);
      toast.success("Lead added");
    }
    setModal({ open: false, lead: null });
    load();
  }

  async function handleDelete(id) {
    await leadService.delete(id);
    setDeleteId(null);
    toast.success("Lead deleted");
    if (leads.length === 1 && page > 0) setPage(p => p - 1);
    else load();
  }

  function getUserName(id) {
    return users.find(u => u.id === id)?.name || "Unassigned";
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalElements} total leads in pipeline</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setModal({ open: true, lead: null })}>
          Add Lead
        </Button>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { label: "New", key: "NEW", color: "text-blue-700 bg-blue-50 border-blue-100" },
          { label: "Contacted", key: "CONTACTED", color: "text-amber-700 bg-amber-50 border-amber-100" },
          { label: "Closed", key: "CLOSED", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
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

      {/* Filters */}
      <Card>
        <div className="p-3 md:p-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="relative">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
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
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FiTarget size={40} className="mb-3 opacity-30" />
            <p className="font-medium">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden divide-y divide-gray-100">
              {leads.map(lead => (
                <div key={lead.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.company}</p>
                      </div>
                    </div>
                    <Badge value={lead.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pl-12">
                    <span className="flex items-center gap-1"><FiMail size={11} />{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 pl-12">
                      <FiPhone size={11} />{lead.phone}
                    </div>
                  )}
                  <div className="flex items-center justify-between pl-12">
                    <span className="text-xs text-gray-400">Assigned: {getUserName(lead.assignedTo)}</span>
                    <div className="flex gap-1">
                      <button onClick={() => setModal({ open: true, lead })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(lead.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Name", "Company", "Contact", "Status", "Assigned To", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-400">{lead.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{lead.company}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{lead.email}</p>
                        <p className="text-xs text-gray-400">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-3"><Badge value={lead.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{getUserName(lead.assignedTo)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setModal({ open: true, lead })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => setDeleteId(lead.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              Page {page + 1} of {totalPages} &nbsp;·&nbsp; {totalElements} leads
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

        {totalPages <= 1 && leads.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            Showing {leads.length} of {totalElements} leads
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false, lead: null })} title={modal.lead ? "Edit Lead" : "Add New Lead"}>
        <LeadForm lead={modal.lead} users={users} onSave={handleSave} onCancel={() => setModal({ open: false, lead: null })} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead" size="sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteId)}>Delete Lead</Button>
        </div>
      </Modal>
    </div>
  );
}
