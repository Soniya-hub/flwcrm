import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiZap, FiUser, FiMail, FiLock } from "react-icons/fi";
import Button from "../ui/Button";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success("Account created! Welcome to FlowCRM");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: "name", label: "Full name", type: "text", placeholder: "John Smith", icon: FiUser },
    { name: "email", label: "Email address", type: "email", placeholder: "you@company.com", icon: FiMail },
    { name: "password", label: "Password", type: "password", placeholder: "Min. 6 characters", icon: FiLock },
    { name: "confirm", label: "Confirm password", type: "password", placeholder: "Re-enter password", icon: FiLock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FiZap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">FlowCRM</h1>
          <p className="text-slate-400 mt-1 text-sm">Business Automation Platform</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
          <p className="text-slate-400 text-sm mb-6">Start your 14-day free trial today.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={type}
                    required
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}

            <Button type="submit" loading={loading} className="w-full justify-center py-2.5 mt-2">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
