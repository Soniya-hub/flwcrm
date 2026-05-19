import React, { useState } from "react";
import Input, { Select, Textarea } from "../ui/Input";
import Button from "../ui/Button";

const defaultForm = { title: "", description: "", priority: "MEDIUM", status: "TODO", dueDate: "", assignedTo: "" };

export default function TaskForm({ task, users, onSave, onCancel }) {
  const [form, setForm] = useState(task ? {
    title: task.title, description: task.description, priority: task.priority,
    status: task.status, dueDate: task.dueDate, assignedTo: task.assignedTo || "",
  } : defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await onSave({ ...form, assignedTo: form.assignedTo ? Number(form.assignedTo) : null });
    setLoading(false);
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Task Title *" value={form.title} onChange={set("title")} placeholder="e.g. Send proposal to client" error={errors.title} />
      <Textarea label="Description" value={form.description} onChange={set("description")} placeholder="What needs to be done..." />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Priority" value={form.priority} onChange={set("priority")}>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </Select>
        <Select label="Status" value={form.status} onChange={set("status")}>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Due Date *" type="date" value={form.dueDate} onChange={set("dueDate")} error={errors.dueDate} />
        <Select label="Assign To" value={form.assignedTo} onChange={set("assignedTo")}>
          <option value="">Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{task ? "Update Task" : "Create Task"}</Button>
      </div>
    </form>
  );
}
