export const MOCK_USERS = [
  { id: 1, name: "Admin User", email: "admin@crm.com", password: "admin123", role: "ADMIN", status: "ACTIVE", createdAt: "2024-01-01" },
  { id: 2, name: "John Smith", email: "john@crm.com", password: "user123", role: "USER", status: "ACTIVE", createdAt: "2024-02-15" },
  { id: 3, name: "Sarah Lee", email: "sarah@crm.com", password: "user123", role: "USER", status: "ACTIVE", createdAt: "2024-03-10" },
  { id: 4, name: "Mike Chen", email: "mike@crm.com", password: "user123", role: "USER", status: "INACTIVE", createdAt: "2024-04-05" },
];

export const MOCK_LEADS = [
  { id: 1, name: "Alice Johnson", email: "alice@techcorp.com", phone: "+1-555-0101", company: "TechCorp Inc.", notes: "Interested in Enterprise plan", status: "NEW", assignedTo: 2, createdAt: "2024-05-01" },
  { id: 2, name: "Bob Williams", email: "bob@startupxyz.com", phone: "+1-555-0102", company: "StartupXYZ", notes: "Requested demo call", status: "CONTACTED", assignedTo: 3, createdAt: "2024-05-03" },
  { id: 3, name: "Carol Davis", email: "carol@megacorp.io", phone: "+1-555-0103", company: "MegaCorp IO", notes: "Signed contract", status: "CLOSED", assignedTo: 2, createdAt: "2024-05-05" },
  { id: 4, name: "David Brown", email: "david@innovate.co", phone: "+1-555-0104", company: "Innovate Co", notes: "Follow up next week", status: "CONTACTED", assignedTo: 3, createdAt: "2024-05-07" },
  { id: 5, name: "Emma Wilson", email: "emma@ventures.com", phone: "+1-555-0105", company: "Wilson Ventures", notes: "Budget approved", status: "NEW", assignedTo: 2, createdAt: "2024-05-10" },
  { id: 6, name: "Frank Miller", email: "frank@globaltech.net", phone: "+1-555-0106", company: "GlobalTech Net", notes: "Trial period started", status: "CONTACTED", assignedTo: 3, createdAt: "2024-05-12" },
  { id: 7, name: "Grace Taylor", email: "grace@nexgen.io", phone: "+1-555-0107", company: "NexGen IO", notes: "Contract closed", status: "CLOSED", assignedTo: 2, createdAt: "2024-05-14" },
  { id: 8, name: "Henry Anderson", email: "henry@solutions.co", phone: "+1-555-0108", company: "Solutions Co", notes: "Needs follow-up", status: "NEW", assignedTo: 3, createdAt: "2024-05-15" },
];

export const MOCK_TASKS = [
  { id: 1, title: "Send proposal to TechCorp", description: "Prepare and send detailed proposal", priority: "HIGH", status: "TODO", dueDate: "2024-05-20", assignedTo: 2, createdAt: "2024-05-01" },
  { id: 2, title: "Schedule demo call with StartupXYZ", description: "Arrange product demo", priority: "MEDIUM", status: "IN_PROGRESS", dueDate: "2024-05-18", assignedTo: 3, createdAt: "2024-05-03" },
  { id: 3, title: "Follow up with MegaCorp", description: "Post-contract follow-up call", priority: "LOW", status: "DONE", dueDate: "2024-05-10", assignedTo: 2, createdAt: "2024-05-05" },
  { id: 4, title: "Prepare Q2 sales report", description: "Compile Q2 statistics and insights", priority: "HIGH", status: "TODO", dueDate: "2024-05-25", assignedTo: 2, createdAt: "2024-05-07" },
  { id: 5, title: "Update CRM records", description: "Clean up and update all lead records", priority: "MEDIUM", status: "IN_PROGRESS", dueDate: "2024-05-22", assignedTo: 3, createdAt: "2024-05-10" },
  { id: 6, title: "Client onboarding - GlobalTech", description: "Setup and onboard GlobalTech team", priority: "HIGH", status: "TODO", dueDate: "2024-05-28", assignedTo: 3, createdAt: "2024-05-12" },
];

export const MOCK_ACTIVITY = [
  { id: 1, action: "New lead added", detail: "Alice Johnson from TechCorp Inc.", time: "2 min ago", type: "lead" },
  { id: 2, action: "Task completed", detail: "Follow up with MegaCorp", time: "1 hour ago", type: "task" },
  { id: 3, action: "Lead status updated", detail: "Bob Williams → Contacted", time: "3 hours ago", type: "lead" },
  { id: 4, action: "New user registered", detail: "Sarah Lee joined the team", time: "Yesterday", type: "user" },
  { id: 5, action: "Task assigned", detail: "Prepare Q2 sales report → John Smith", time: "Yesterday", type: "task" },
  { id: 6, action: "Lead closed", detail: "Grace Taylor - Contract signed", time: "2 days ago", type: "lead" },
];

export const CHART_DATA = {
  revenueMonthly: [
    { month: "Jan", revenue: 42000, leads: 28 },
    { month: "Feb", revenue: 55000, leads: 35 },
    { month: "Mar", revenue: 48000, leads: 30 },
    { month: "Apr", revenue: 67000, leads: 42 },
    { month: "May", revenue: 72000, leads: 48 },
    { month: "Jun", revenue: 61000, leads: 38 },
    { month: "Jul", revenue: 85000, leads: 55 },
    { month: "Aug", revenue: 91000, leads: 60 },
    { month: "Sep", revenue: 78000, leads: 50 },
    { month: "Oct", revenue: 95000, leads: 63 },
    { month: "Nov", revenue: 88000, leads: 57 },
    { month: "Dec", revenue: 102000, leads: 68 },
  ],
  leadStatus: [
    { name: "New", value: 35, color: "#3b82f6" },
    { name: "Contacted", value: 45, color: "#f59e0b" },
    { name: "Closed", value: 20, color: "#10b981" },
  ],
};
