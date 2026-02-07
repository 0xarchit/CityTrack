"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { Building2, Plus, Search } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  default_sla_hours: number;
  is_active: boolean;
  member_count: number;
}

export default function DepartmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    default_sla_hours: 48,
  });
  const { data, loading, revalidate } =
    useCachedFetch<Department[]>("/admin/departments");
  const departments = data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/admin/departments", formData);
      setShowForm(false);
      setFormData({
        name: "",
        code: "",
        description: "",
        default_sla_hours: 48,
      });
      revalidate();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create department";
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-600 font-medium max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        Loading Departments...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Departments</h2>
          <p className="text-sm text-slate-500 font-medium">
            Organizational units and SLA configurations.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-urban-primary text-white font-semibold rounded-xl hover:bg-emerald-600 transition shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Department
        </button>
      </div>

      {showForm && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-urban-md border border-slate-200/70 overflow-hidden">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70">
            <h2 className="text-lg font-black text-slate-800">
              Create New Department
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="e.g., Public Works Department"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                  placeholder="e.g., PWD"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="dept-desc"
              >
                Description
              </label>
              <textarea
                id="dept-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
                rows={2}
                placeholder="Brief description of responsibilities..."
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="dept-sla"
              >
                Default SLA (Hours)
              </label>
              <input
                id="dept-sla"
                type="number"
                value={formData.default_sla_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    default_sla_hours: parseInt(e.target.value),
                  })
                }
                className="w-32 px-4 py-2.5 bg-white/70 border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-urban-primary/10 focus:border-urban-primary/40 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-urban-primary text-white font-semibold rounded-xl hover:bg-emerald-600 transition shadow-sm"
              >
                Create Department
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-white/80 text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {departments.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70">
            <Building2 className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-slate-500 mt-4 text-lg">No departments found.</p>
            <p className="text-slate-400 text-sm">
              Create your first organizational unit to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-urban-sm border border-slate-200/70 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Staff Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-urban-primary/5 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 rounded-xl bg-urban-primary/10 text-urban-primary flex items-center justify-center font-bold text-sm">
                          {dept.code}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">
                            {dept.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Code: {dept.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-1">
                        {dept.description || "-"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        SLA: {dept.default_sla_hours}h
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dept.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dept.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className="text-slate-900 font-bold">
                        {dept.member_count}
                      </span>
                      <span className="text-slate-500 ml-1">staff</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
