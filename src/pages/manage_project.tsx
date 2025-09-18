import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import type { Commit, Project } from "../utils/mainTypes";
import { db } from "../utils/db";
import toast from "react-hot-toast";
import { Icon } from "../components/global/UI/Icon";
import daysAgo from "../utils/fetchDays";


/* ---------- Small UI helpers ---------- */
const Badge = ({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "green" | "yellow" | "red" }) => {
  const toneMap: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${toneMap[tone]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow-xs">
    <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-zinc-800">{value}</div>
    </div>
  </div>
);

/* ---------- Tab component ---------- */
type TabKey = "overview" | "contributions" | "settings";

const Tabs = ({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "contributions", label: "Contributions" },
    { key: "settings", label: "Settings" },
  ];
  return (
    <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200 max-sm:w-full">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            active === t.key ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-gray-100"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

/* ---------- Main ManageProject Page ---------- */
export default function ManageProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentUser, currentTeam } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [tab, setTab] = useState<TabKey>("overview");

  // fetch project
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!projectId) return;

    const fetchProject = async () => {
      setLoadingProject(true);
      try {
        const proRef = doc(db, "projects", projectId);
        const proSnap = await getDoc(proRef);
        if (!proSnap.exists()) {
          toast.error("Project not found");
          navigate(-1);
          return;
        }
        // Optional: make sure currentUser is allowed (you had createdBy check)
        if (proSnap.data()?.createdBy !== currentUser.uid && !proSnap.data()?.contributors?.includes(currentUser.uid)) {
          toast.error("Unauthorized to view this project");
          navigate(-1);
          return;
        }

        // convert createdOn if Timestamp exists
        const raw = proSnap.data();
        const createdOn = raw?.createdOn?.toDate ? raw.createdOn.toDate() : raw?.createdOn;
        setProject({ id: proSnap.id, ...raw, createdOn } as Project);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project");
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId, currentUser, navigate]);

  // fetch commits for project (latest first)
  useEffect(() => {
    if (!projectId) return;
    const fetchCommits = async () => {
      setLoadingProject(true);
      try {
        const commitsRef = collection(db, "Commits");
        const q = query(commitsRef, where("projectId", "==", projectId), orderBy("createdOn", "desc"));
        const snap = await getDocs(q);
        const list: Commit[] = snap.docs.map((d) => {
          const data = d.data() as any;
          const createdOn = data.createdOn?.toDate ? data.createdOn.toDate() : data.createdOn ? new Date(data.createdOn) : new Date();
          return { id: d.id, ...data, createdOn } as Commit;
        });
        setCommits(list);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load commits");
      } finally {
        setLoadingProject(false);
      }
    };
    fetchCommits();
  }, [projectId]);

  /* ---------- Derived analytics ---------- */
  const analytics = useMemo(() => {
    const totalCommits = commits.length;
    const contributorsSet = new Set<string>();
    let verified = 0, pending = 0, rejected = 0;
    commits.forEach((c) => {
      if (c.user?.uid) contributorsSet.add(c.user.uid);
      if (c.status === "verified") verified++;
      else if (c.status === "pending") pending++;
      else if (c.status === "rejected") rejected++;
    });
    return {
      totalCommits,
      totalContributors: contributorsSet.size,
      verified,
      pending,
      rejected,
    };
  }, [commits]);

  // recent 8 commits
  const recent8 = useMemo(() => commits.slice(0, 8), [commits]);

  // top 3 contributors last 30 days
  const topContributors = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const map = new Map<string, { uid: string; name?: string; count: number }>();
    commits.forEach((c) => {
      const created = c.createdOn instanceof Date ? c.createdOn : new Date(c.createdOn as any);
      if (created >= cutoff && c.user?.uid) {
        const uid = c.user.uid;
        const entry = map.get(uid) ?? { uid, name: c.user?.name, count: 0 };
        entry.count++;
        map.set(uid, entry);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 3);
  }, [commits]);

  /* ---------- Render loading states ---------- */
  if (loadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" className="w-6 h-6 animate-spin" />
          <span className="text-gray-600">Loading project...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return null; // already handled by redirection above
  }

  /* ---------- Page layout ---------- */
  return (
    <div className="min-h-screen py-6 sm:p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
          <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-end">
            <a href={project.repoLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-sm">
              <Icon name="Github" size={16} strokeWidth={2} /> GitHub Repo
            </a>
            <Tabs active={tab} onChange={setTab} />
          </div>
        </header>

        {/* Main grid */}
        <div className="flex flex-col-reverse sm:grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Overview stats & contributors */}
          <aside className="col-span-1 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm text-gray-600 mb-3">Project stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Commits" value={analytics.totalCommits} icon={<Icon name="GitCommit" />} />
                <StatCard label="Contributors" value={analytics.totalContributors} icon={<Icon name="Users" />} />
                <StatCard label="Verified" value={analytics.verified} icon={<Icon name="CheckCircle" />} />
                <StatCard label="Pending" value={analytics.pending} icon={<Icon name="Clock" />} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm text-gray-600 mb-3">Top contributors (30d)</h3>
              <div className="space-y-2">
                {topContributors.length === 0 && <div className="text-sm text-gray-500">No contributions this month.</div>}
                {topContributors.map((c) => (
                  <div key={c.uid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{(c.name || c.uid).slice(0,1)}</div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{c.name || c.uid}</div>
                        <div className="text-xs text-gray-500">{c.count} commits</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">#{topContributors.indexOf(c)+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right column: Tab content */}
          <main className="col-span-1 lg:col-span-2 space-y-4">
            {/* Content wrapper card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
              {/* Tab header (mobile-visible as well) */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-semibold text-zinc-800 capitalize">{tab}</h2>
                  <div className="text-xs text-gray-500">Project: {project.name}</div>
                </div>
                <div className="text-sm text-gray-500">{currentTeam.name}</div>
              </div>

              <div className="p-4">
                {tab === "overview" && (
                  <OverviewTab project={project} commits={commits} recent8={recent8} analytics={analytics} />
                )}

                {tab === "contributions" && (
                  <ContributionsTab commits={commits} projectName={project.name} />
                )}

                {tab === "settings" && (
                  <SettingsTab project={project} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- OverviewTab Component ---------- */
function OverviewTab({ project, recent8 }: { project: Project; commits: Commit[]; recent8: Commit[]; analytics: any }) {
  const {currentTeam} = useAuth();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-600">Project Info</h3>
          <div className="mt-3 text-sm text-gray-700">
            <p><span className="font-semibold">Repo:</span> <a className="text-blue-600 hover:underline" href={project.repoLink}>{project.repoLink}</a></p>
            <p><span className="font-semibold">Created:</span> {project.createdOn ? new Date(project.createdOn).toLocaleString(): "-"}</p>
            <p><span className="font-semibold">Team:</span> {currentTeam.name}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-600">Contributors</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.contributors?.length ? project.contributors.map((c:string) => (
              <Badge key={c}>{c}</Badge>
            )) : <div className="text-sm text-gray-500">No contributors yet</div>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-600 mb-3">Recent commits</h3>
        <div className="grid grid-cols-1 gap-[1px] bg-gray-200 rounded overflow-hidden">
          {recent8.length === 0 ? (
            <div className="p-4 bg-white text-sm text-gray-500">No recent commits</div>
          ) : recent8.map((c) => (
            <div key={c.id} className="p-3 bg-white flex items-start justify-between gap-3 hover:bg-gray-50">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{c.title}</div>
                <div className="text-xs text-gray-500">{c.message}</div>
                <div className="text-xs text-gray-500 mt-2">{c.user?.name} • {daysAgo(c.createdOn)}d ago</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone={c.status === "verified" ? "green" : c.status === "pending" ? "yellow" : "red"}>
                  {c.status ?? "pending"}
                </Badge>
                <div className="text-xs text-gray-500">{c.branch}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- ContributionsTab Component ---------- */
function ContributionsTab({ commits }: { commits: Commit[]; projectName: string }) {
  // local UI states
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending" | "rejected">("all");
  const [visibleCount, setVisibleCount] = useState(15);

  const filtered = commits.filter((c) => (statusFilter === "all" ? true : (c.status ?? "pending") === statusFilter));

  const rows = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="text-sm border rounded p-1">
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">Showing {rows.length} of {filtered.length}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="px-3 py-2">Commit</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Branch</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-3 py-2">{c.title}<div className="text-xs text-gray-400">{c.message?.slice(0, 60)}</div></td>
                <td className="px-3 py-2">{c.user?.name}</td>
                <td className="px-3 py-2">{c.branch}</td>
                <td className="px-3 py-2">
                  <Badge tone={c.status === "verified" ? "green" : c.status === "pending" ? "yellow" : "red"}>{c.status ?? "pending"}</Badge>
                </td>
                <td className="px-3 py-2">{daysAgo(c.createdOn)}d</td>
                <td className="px-3 py-2">
                  {c.status === "pending" && c.verificationLink ? (
                    <a className="text-sm text-blue-600 hover:underline" href={c.verificationLink} target="_blank" rel="noreferrer">Verify</a>
                  ) : (
                    <span className="text-xs text-gray-500">{c.status === "verified" ? "Verified" : "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleCount < filtered.length && (
        <div className="flex justify-center">
          <button onClick={() => setVisibleCount((v) => v + 15)} className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">Load more</button>
        </div>
      )}
    </div>
  );
}

/* ---------- SettingsTab (placeholder) ---------- */
function SettingsTab({ project }: { project: Project }) {
  return (
    <div>
      <h3 className="text-sm text-gray-600">Project Settings</h3>
      <div className="mt-4 text-sm text-gray-700">
        <h2 className="text-lg font-semibold py-4 capitalize">{project?.name}</h2>
        <p className="text-gray-600 pb-3">{project.description}</p>
        <div className="py-5">
          <h3 className="uppercase text-sm pb-2">Branches</h3>
          <div className="flex items-center justify-start gap-2">
            {project.branches.map((b, i)=> (
              <Badge key={i}>{b}</Badge>
            ))}
          </div>
        </div>
        {/* Add form controls for editing project metadata, contributors management, and webhooks */}
        <p className="text-gray-500">Manage project metadata, collaborators, and webhooks here. (Coming soon)</p>
      </div>
    </div>
  );
}
