import React, { useState } from "react";
import Input, { Select, Textarea } from "../ui/Input";
import Button from "../ui/Button";

const defaultForm = { name: "", email: "", phone: "", company: "", notes: "", status: "NEW", assignedTo: "" };

export default function LeadForm({ lead, users, onSave, onCancel }) {
  const [form, setForm] = useState(lead ? {
    name: lead.name, email: lead.email, phone: lead.phone,
    company: lead.company, notes: lead.notes, status: lead.status,
    assignedTo: lead.assignedTo || "",
  } : defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.company.trim()) e.company = "Company is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    await onSave({ ...form, assignedTo: form.assignedTo ? Number(form.assignedTo) : null });
    setLoading(false);
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name *" value={form.name} onChange={set("name")} placeholder="Alice Johnson" error={errors.name} />
        <Input label="Email *" type="email" value={form.email} onChange={set("email")} placeholder="alice@company.com" error={errors.email} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1-555-0000" />
        <Input label="Company *" value={form.company} onChange={set("company")} placeholder="Acme Corp" error={errors.company} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" value={form.status} onChange={set("status")}>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </Select>
        <Select label="Assign To" value={form.assignedTo} onChange={set("assignedTo")}>
          <option value="">Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
      </div>
      <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Add any relevant notes..." />
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{lead ? "Update Lead" : "Add Lead"}</Button>
      </div>
    </form>
  );
}
