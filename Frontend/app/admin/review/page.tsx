"use client";
import { useMemo, useState } from "react";
import { apiPost } from "@/lib/api";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { CheckCircle2, XCircle } from "lucide-react";

interface Issue {
  id: string;
  description: string;
  state: string;
  city: string;
  locality: string;
  created_at: string;
  full_address: string;
  images: { file_path: string; annotated_path: string }[];
  priority: number;
}

export default function ManualReviewPage() {
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const { data, loading, revalidate } = useCachedFetch<{ items: Issue[] }>(
    "/issues?state=reported",
  );

  const issues = useMemo(() => data?.items || [], [data]);
  const visibleIssues = useMemo(
    () => issues.filter((issue) => !removedIds.has(issue.id)),
    [issues, removedIds],
  );

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    try {
      const data = await apiPost<{ message: string }>(
        `/admin/issues/${id}/review`,
        { status },
      );
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      revalidate();
      alert(data.message);
    } catch (error) {
      console.error("Review failed", error);
      alert("Failed to review issue");
    }
  };

  if (loading) {
    return (
      <div className="text-slate-600 font-medium max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        Loading Reviews...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Manual Review Queue
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Validate incoming citizen reports before assignment.
          </p>
        </div>
        <div className="bg-urban-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {visibleIssues.length} Pending
        </div>
      </div>

      {visibleIssues.length === 0 ? (
        <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-urban-sm">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
          <p className="text-slate-900 font-medium mt-4 text-lg">
            All caught up!
          </p>
          <p className="text-slate-500">No issues pending manual review.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {visibleIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-urban-sm overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 h-64 md:h-auto bg-slate-100 relative">
                {issue.images?.[0] ? (
                  <img
                    src={
                      issue.images[0].annotated_path ||
                      issue.images[0].file_path
                    }
                    alt="Evidence"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                      {issue.city}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {issue.description || "No description"}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {issue.full_address || issue.locality}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100/70">
                  <button
                    onClick={() => handleReview(issue.id, "approved")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Assign
                  </button>
                  <button
                    onClick={() => handleReview(issue.id, "rejected")}
                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
