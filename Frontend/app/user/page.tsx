"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useCachedFetch } from "@/hooks/useCachedFetch";
import { Smartphone, FileText, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface Issue {
  id: string;
  description: string;
  priority: number | null;
  state: string;
  city: string | null;
  locality: string | null;
  full_address: string | null;
  created_at: string;
  category: string | null;
  confidence: number | null;
  image_urls: string[];
  annotated_urls: string[];
  sla_deadline: string | null;
}

interface IssuesResponse {
  items: Issue[];
}

export default function UserDashboard() {
  const { user, role, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (role !== "user") {
        router.push("/signin");
      }
    }
  }, [authLoading, role, router]);

  // Only fetch if user ID is available
  const fetchUrl = user?.id ? `/issues?user_id=${user.id}` : "";
  const { data: issuesResponse, loading: issuesLoading } =
    useCachedFetch<IssuesResponse>(fetchUrl);

  const issues = issuesResponse?.items || [];
  const contentLoading = issuesLoading && !issuesResponse;

  const getStateBadge = (state: string) => {
    const styles: Record<string, string> = {
      reported: "bg-blue-100 text-blue-800",
      assigned: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-slate-100 text-slate-600",
      escalated: "bg-red-100 text-red-800",
      validated: "bg-emerald-100 text-emerald-800",
      pending_confirmation: "bg-slate-200 text-slate-700",
      pending_verification: "bg-indigo-100 text-indigo-800",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[state] || styles.reported}`}
      >
        {state.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-urban-primary rounded-xl flex items-center justify-center shadow-lg shadow-urban-primary/20 group-hover:scale-105 transition-transform">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  CityTrack
                </h1>
                <p className="text-[10px] font-bold text-urban-primary uppercase tracking-widest">
                  Citizen Portal
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block border-r border-slate-200 pr-6">
                <p className="text-sm font-bold text-slate-900">
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "Citizen"}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 p-8 bg-gradient-to-br from-urban-primary to-emerald-600 rounded-2xl shadow-xl shadow-urban-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-white font-bold text-2xl mb-2">
              Report an Issue
            </h3>
            <p className="text-emerald-50 max-w-xl leading-relaxed font-medium">
              Notice something wrong in your neighborhood? Use our mobile app to
              report issues with instant GPS tagging and AI verification.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                  Available for
                </p>
                <p className="text-sm font-bold text-white">Android & iOS</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
              Total Reports
            </p>
            {contentLoading ? (
              <Skeleton className="mt-2 h-10 w-24" />
            ) : (
              <p className="text-4xl font-black text-slate-900">
                {issues.length}
              </p>
            )}
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">
              Resolved
            </p>
            {contentLoading ? (
              <Skeleton className="mt-2 h-10 w-24" />
            ) : (
              <p className="text-4xl font-black text-emerald-600">
                {issues.filter((i) => i.state === "resolved").length}
              </p>
            )}
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">
              Active Cases
            </p>
            {contentLoading ? (
              <Skeleton className="mt-2 h-10 w-24" />
            ) : (
              <p className="text-4xl font-black text-amber-500">
                {
                  issues.filter((i) =>
                    [
                      "reported",
                      "assigned",
                      "in_progress",
                      "pending_verification",
                    ].includes(i.state),
                  ).length
                }
              </p>
            )}
          </div>
          <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-urban-primary text-[10px] font-bold uppercase tracking-widest mb-1">
              Efficiency
            </p>
            {contentLoading ? (
              <Skeleton className="mt-2 h-10 w-24" />
            ) : (
              <p className="text-4xl font-black text-urban-primary">
                {issues.length > 0
                  ? Math.round(
                      (issues.filter((i) => i.state === "resolved").length /
                        issues.length) *
                        100,
                    )
                  : 0}
                %
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">My Activity</h2>
            <p className="text-sm text-slate-500 font-medium">
              List of all reports submitted by you
            </p>
          </div>
        </div>

        {contentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-white/60 p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-7 w-3/4 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold text-xl">No reports found</p>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Your report history will appear here once you submit an issue
              through the app.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/user/issues/${issue.id}`}
                className="group bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getStateBadge(issue.state)}
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {issue.category || "General"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-md">
                    {new Date(issue.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-urban-primary transition-colors">
                  {issue.description || "No description provided"}
                </h3>

                <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-urban-primary" />
                    </div>
                    <span className="line-clamp-1 font-medium">
                      {issue.full_address ||
                        [issue.locality, issue.city]
                          .filter(Boolean)
                          .join(", ") ||
                        "Location pending"}
                    </span>
                  </div>

                  {issue.image_urls?.[0] && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group-hover:shadow-inner">
                      <img
                        src={issue.image_urls[0]}
                        alt="Issue"
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 bg-white/80 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
            Developed for CityTrack
          </p>
          <p className="text-xs font-medium">
            Improving Urban Life with AI Governance
          </p>
        </div>
      </footer>
    </div>
  );
}
