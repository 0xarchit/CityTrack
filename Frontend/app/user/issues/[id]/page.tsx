"use client";
import { useParams } from "next/navigation";

export const runtime = "edge";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ImageIcon,
  Activity,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

interface IssueEvent {
  id: string;
  event_type: string;
  created_at: string;
  data: any;
}

interface Issue {
  id: string;
  description: string;
  state: string;
  city: string | null;
  locality: string | null;
  created_at: string;
  updated_at: string;
  full_address: string | null;
  priority: number | null;
  priority_reason: string | null;
  category: string | null;
  confidence: number | null;
  detections_count: number | null;
  validation_source: string | null;
  geo_status: string | null;
  is_duplicate: boolean | null;
  parent_issue_id: string | null;
  nearby_count: number | null;
  department: string | null;
  assigned_member: string | null;
  image_urls: string[] | null;
  annotated_urls: string[] | null;
  proof_image_url: string | null;
  sla_hours: number | null;
  sla_deadline: string | null;
  agent_flow: IssueEvent[] | null;
  latitude: number | null;
  longitude: number | null;
}

export default function UserIssueDetailPage() {
  const params = useParams();
  const issueId = typeof params.id === "string" ? params.id : params.id?.[0];
  const { data: issue, loading } = useCachedFetch<Issue>(
    issueId ? `/issues/${issueId}` : "",
  );
  const contentLoading = loading && !issue;

  const getStateBadge = (state: string) => {
    const styles: Record<string, string> = {
      reported: "bg-blue-100 text-blue-800 border-blue-200",
      assigned: "bg-amber-100 text-amber-800 border-amber-200",
      in_progress: "bg-orange-100 text-orange-800 border-orange-200",
      resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      closed: "bg-slate-100 text-slate-600 border-slate-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      escalated: "bg-red-100 text-red-800 border-red-200",
      validated: "bg-emerald-100 text-emerald-800 border-emerald-200",
      pending_confirmation: "bg-slate-200 text-slate-700 border-slate-300",
      pending_verification: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[state] || styles.reported}`}
      >
        {state.replace("_", " ")}
      </span>
    );
  };

  const formatText = (value: string | null | undefined) =>
    value && value.trim() ? value : "—";

  const formatDate = (value: string | null | undefined) =>
    value ? new Date(value).toLocaleString() : "—";

  const formatBool = (value: boolean | null | undefined) =>
    value === null || value === undefined ? "—" : value ? "Yes" : "No";

  const formatNumber = (value: number | null | undefined) =>
    value === null || value === undefined ? "—" : value.toString();

  const formatConfidence = (value: number | null | undefined) =>
    value === null || value === undefined
      ? "—"
      : `${(value * 100).toFixed(1)}%`;

  const formatCoords = (value: number | null | undefined) =>
    value === null || value === undefined ? "—" : value.toFixed(6);

  if (contentLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-20 w-full mb-8 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-100 w-full rounded-3xl" />
              <Skeleton className="h-50 w-full rounded-3xl" />
            </div>
            <Skeleton className="h-150 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-transparent p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-700">Issue Not Found</h2>
        <Link
          href="/user"
          className="mt-4 text-urban-primary hover:underline font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const addressText =
    issue.full_address ||
    [issue.locality, issue.city].filter(Boolean).join(", ") ||
    "—";

  const dataRows = [
    { label: "Issue ID", value: issue.id },
    { label: "State", value: formatText(issue.state) },
    { label: "Category", value: formatText(issue.category) },
    { label: "Description", value: formatText(issue.description) },
    { label: "Full Address", value: addressText },
    { label: "Locality", value: formatText(issue.locality) },
    { label: "City", value: formatText(issue.city) },
    { label: "Priority", value: formatNumber(issue.priority) },
    { label: "Priority Reason", value: formatText(issue.priority_reason) },
    { label: "Confidence", value: formatConfidence(issue.confidence) },
    { label: "Detections", value: formatNumber(issue.detections_count) },
    { label: "Validation Source", value: formatText(issue.validation_source) },
    { label: "Geo Status", value: formatText(issue.geo_status) },
    { label: "Duplicate", value: formatBool(issue.is_duplicate) },
    { label: "Parent Issue", value: formatText(issue.parent_issue_id) },
    { label: "Nearby Count", value: formatNumber(issue.nearby_count) },
    { label: "Department", value: formatText(issue.department) },
    { label: "Assigned Member", value: formatText(issue.assigned_member) },
    { label: "SLA Hours", value: formatNumber(issue.sla_hours) },
    { label: "SLA Deadline", value: formatDate(issue.sla_deadline) },
    { label: "Created", value: formatDate(issue.created_at) },
    { label: "Updated", value: formatDate(issue.updated_at) },
    { label: "Latitude", value: formatCoords(issue.latitude) },
    { label: "Longitude", value: formatCoords(issue.longitude) },
  ];

  return (
    <div className="min-h-screen bg-transparent font-sans pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/user" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-urban-primary transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  Issue Details
                </h1>
                <p className="text-[10px] font-bold text-urban-primary uppercase tracking-widest">
                  Back to Dashboard
                </p>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 uppercase tracking-tighter">
                  ID: {issue.id.slice(0, 12)}...
                </span>
                {getStateBadge(issue.state)}
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-1 border-l border-slate-200">
                  {issue.category || "General"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                {issue.category || "Reported Issue"}
              </h1>
              <p className="text-slate-600 font-medium text-lg mt-3 max-w-3xl">
                {issue.description || "No description provided."}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-urban-primary" />
                  <span className="text-sm">{addressText}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">
                    Reported {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {issue.priority !== null && (
              <div className="flex flex-col items-center lg:items-end gap-3 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm min-w-50">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Priority Rating
                </div>
                <div
                  className={`text-2xl font-black ${
                    issue.priority === 1
                      ? "text-red-500"
                      : issue.priority === 2
                        ? "text-orange-500"
                        : "text-emerald-500"
                  }`}
                >
                  {issue.priority === 1
                    ? "Critical"
                    : issue.priority === 2
                      ? "High Priority"
                      : "Standard"}
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      issue.priority === 1
                        ? "bg-red-500 w-full"
                        : issue.priority === 2
                          ? "bg-orange-500 w-2/3"
                          : "bg-emerald-500 w-1/3"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-10">
          {/* Metadata Grid */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-urban-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-urban-primary" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                System Analysis
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {dataRows
                .filter(
                  (row) =>
                    row.value !== "—" &&
                    row.value !== "" &&
                    row.value !== null &&
                    row.value !== undefined,
                )
                .map((row, i) => (
                  <div key={i} className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 group-hover:text-urban-primary transition-colors">
                      {row.label}
                    </label>
                    <p
                      className="text-sm font-bold text-slate-700 truncate"
                      title={row.value?.toString()}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Visual Evidence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {issue.image_urls?.[0] ? (
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Original Capture
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group">
                    <img
                      src={issue.image_urls[0]}
                      alt="Evidence"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs font-bold">No evidence attached</p>
                </div>
              )}

              {issue.annotated_urls?.[0] && (
                <div className="space-y-3">
                  <p className="text-xs font-black text-urban-primary uppercase tracking-widest">
                    AI Vision Analysis
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-urban-primary/30 group">
                    <img
                      src={issue.annotated_urls[0]}
                      alt="AI Analysis"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-urban-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

              {issue.proof_image_url ? (
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Resolution Proof
                  </p>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-200 group">
                    <img
                      src={issue.proof_image_url}
                      alt="Proof"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-emerald-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ) : (
                <div className="h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mb-2 animate-pulse">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold">Awaiting resolution proof</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto text-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Support
            </h3>
            <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
              If this issue remains unresolved or was flagged incorrectly,
              please contact your local department office.
            </p>
            <button className="w-full md:w-auto px-12 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-2xl uppercase tracking-widest transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
