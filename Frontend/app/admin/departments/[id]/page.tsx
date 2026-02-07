"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export const runtime = "edge";
import { apiGet, apiPost } from "@/lib/api";
import {
  ArrowLeft,
  Users,
  Plus,
  Mail,
  Phone,
  Briefcase,
  Shield,
  MapPin,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  default_sla_hours: number;
  is_active: boolean;
  member_count: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  current_workload: number;
  max_workload: number;
  is_active: boolean;
  phone?: string;
  city?: string;
}

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState<Department | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "worker",
    password: "",
    phone: "",
    city: "",
    max_workload: 10,
  });

  useEffect(() => {
    if (params.id) {
      loadData(params.id as string);
    }
  }, [params.id]);

  const loadData = async (deptId: string) => {
    try {
      const [deptData, membersData] = await Promise.all([
        apiGet<Department>(`/admin/departments/${deptId}`),
        apiGet<Member[]>(`/admin/members?department_id=${deptId}`),
      ]);
      setDepartment(deptData);
      setMembers(membersData);
    } catch (error) {
      console.error("Failed to load department data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;

    try {
      await apiPost("/admin/members", {
        ...newMember,
        department_id: department.id,
        locality: "General",
      });
      setShowAddMember(false);
      setNewMember({
        name: "",
        email: "",
        role: "worker",
        password: "",
        phone: "",
        city: "",
        max_workload: 10,
      });
      loadData(department.id);
      alert("Member added successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to add member");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const token = localStorage.getItem("supabase_token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/members/${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMembers(members.filter((m) => m.id !== memberId));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500">
        Loading Department...
      </div>
    );
  }

  if (!department) {
    return <div className="p-8 text-center">Department not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <Link
          href="/admin/departments"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-urban-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900">
                {department.name}
              </h1>
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-mono font-bold border border-slate-200">
                {department.code}
              </span>
            </div>
            <p className="text-slate-500">
              {department.description || "No description provided."}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                SLA Limit
              </div>
              <div className="font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded border border-slate-200">
                {department.default_sla_hours}h
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-urban-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Total Staff
              </p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {members.length}
              </h3>
            </div>
            <div className="h-10 w-10 bg-urban-primary/10 rounded-lg flex items-center justify-center text-urban-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            Department Members
          </h2>
          <button
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-urban-primary text-white font-semibold rounded-xl hover:bg-emerald-600 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Worker
          </button>
        </div>

        {showAddMember && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-urban-sm p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/70">
              <h3 className="text-lg font-black text-slate-800">
                Add New Member
              </h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
            <form
              onSubmit={handleAddMember}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  Full Name
                </label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="John Doe"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="john@city.gov"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                >
                  <option value="worker">Field Worker</option>
                  <option value="officer">Department Officer</option>
                  <option value="admin">Admin (Restricted)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  Initial Password
                </label>
                <input
                  required
                  type="password"
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="••••••••"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  Phone (Optional)
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="+1 234..."
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">
                  City (Optional)
                </label>
                <input
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="East District"
                  value={newMember.city}
                  onChange={(e) =>
                    setNewMember({ ...newMember, city: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-5 py-2.5 bg-white/80 text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-urban-primary text-white font-semibold rounded-xl hover:bg-emerald-600 transition"
                >
                  Create Member Account
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-urban-sm p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200/70">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Name / Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Workload
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-urban-primary/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          member.role === "admin"
                            ? "bg-purple-100 text-purple-600"
                            : member.role === "officer"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {member.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        member.role === "worker"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : member.role === "officer"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-purple-50 text-purple-700 border-purple-100"
                      }`}
                    >
                      {member.role === "worker" ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <Shield className="w-3 h-3" />
                      )}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${member.current_workload > 5 ? "bg-amber-500" : "bg-urban-primary"}`}
                          style={{
                            width: `${(member.current_workload / (member.max_workload || 10)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        {member.current_workload}/{member.max_workload || 10}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member.city ? (
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {member.city}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No members found in this department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
