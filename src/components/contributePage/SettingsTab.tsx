// SettingsTab.tsx (or inline in ManageProject file)
import React, { useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import type { Project } from "../../utils/mainTypes";
import { useAuth } from "../../context/useAuth";
import { db } from "../../utils/db";

type SettingsTabProps = {
  project: Project;
  onProjectUpdated?: (p: Project) => void;
};

type SimpleUser = { uid: string; name?: string; email?: string };

export default function SettingsTab({ project, onProjectUpdated }: SettingsTabProps) {
  const { currentUser } = useAuth();
  const [searchEmail, setSearchEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SimpleUser[]>([]);
  const [addingUid, setAddingUid] = useState<string | null>(null);

  // NEW USER FORM state
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", displayName: "", password: "" });

  // ------------- Search existing users by email -------------
  const handleSearch = async () => {
    if (!searchEmail) return toast.error("Type an email to search");
    setSearchLoading(true);
    try {
      const usersRef = collection(db, "users"); // assuming you keep a users collection
      const q = query(usersRef, where("email", "==", searchEmail));
      const snap = await getDocs(q);
      const results: SimpleUser[] = snap.docs.map((d) => ({
        uid: d.id,
        email: (d.data() as any).email,
        name: (d.data() as any).name,
      }));
      setSearchResults(results);
      if (results.length === 0) toast("No users found");
    } catch (err) {
      console.error(err);
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  // ------------- Add existing user to project contributors -------------
  const handleAddExisting = async (uid: string) => {
    if (!project?.id) return;
    setAddingUid(uid);
    try {
      const projRef = doc(db, "projects", project.id);
      await updateDoc(projRef, { contributors: arrayUnion(uid) });
      toast.success("User added to contributors");

      // fetch updated project doc and call parent callback if provided
      const updatedSnap = await getDoc(projRef);
      if (updatedSnap.exists() && onProjectUpdated) {
        const raw = updatedSnap.data();
        const createdOn = raw?.createdOn?.toDate ? raw.createdOn.toDate() : raw?.createdOn;
        onProjectUpdated({ id: updatedSnap.id, ...raw, createdOn } as Project);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    } finally {
      setAddingUid(null);
    }
  };

  // ------------- Create new user via secure server endpoint -------------
  // NOTE: creating a Firebase Auth user from client will sign you out.
  // Instead call a secured server endpoint (Cloud Function) that uses Admin SDK to create the user.
  const handleCreateNewUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.displayName) {
      return toast.error("Provide email, name and password");
    }

    setCreating(true);
    try {
      // Example: POST to your Cloud Function /api/createUser
      // The server should create the Auth user and create a `users/{uid}` doc
      // and return the created uid on success.
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          displayName: newUser.displayName,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "server error");
      }

      const { uid } = await res.json();

      // Add to project contributors
      const projRef = doc(db, "projects", project.id);
      await updateDoc(projRef, { contributors: arrayUnion(uid) });

      // fetch updated project and callback
      const updatedSnap = await getDoc(projRef);
      if (updatedSnap.exists() && onProjectUpdated) {
        const raw = updatedSnap.data();
        const createdOn = raw?.createdOn?.toDate ? raw.createdOn.toDate() : raw?.createdOn;
        onProjectUpdated({ id: updatedSnap.id, ...raw, createdOn } as Project);
      }

      toast.success("New user created and added as contributor");
      // clear form
      setNewUser({ email: "", displayName: "", password: "" });
      setSearchResults([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  // Simple guard: only project owner (createdBy) or contributor can manage
  const canManage = project?.createdBy === currentUser?.uid || project?.contributors?.includes(currentUser?.uid);

  if (!canManage) {
    return <div className="p-4 text-sm text-gray-600">You don't have permission to manage contributors.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm text-gray-600">Manage Contributors</h3>

      {/* Search existing */}
      <div className="bg-white border border-gray-200 rounded p-3">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2 text-sm"
            placeholder="Search user by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button className="px-3 py-2 bg-zinc-900 text-white rounded text-sm" onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-3 space-y-2">
          {searchResults.map((u) => (
            <div key={u.uid} className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{u.name ?? u.email}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
              <div>
                <button
                  className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                  onClick={() => handleAddExisting(u.uid)}
                  disabled={addingUid === u.uid}
                >
                  {addingUid === u.uid ? "Adding..." : "Add to project"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create new user (server-side) */}
      <div className="bg-white border border-gray-200 rounded p-3">
        <h4 className="text-sm text-gray-700 mb-2">Create new user and add</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="p-2 border rounded text-sm" placeholder="Full name" value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} />
          <input className="p-2 border rounded text-sm" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <input className="p-2 border rounded text-sm" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        </div>
        <div className="mt-2 flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={handleCreateNewUser} disabled={creating}>
            {creating ? "Creating..." : "Create and add"}
          </button>
          <small className="text-xs text-gray-500 self-center">Creating users requires a secure server endpoint (avoid creating via client to keep admin session).</small>
        </div>
      </div>

      {/* current contributors */}
      <div className="bg-white border border-gray-200 rounded p-3">
        <h4 className="text-sm text-gray-700 mb-2">Current contributors</h4>
        <div className="flex flex-wrap gap-2">
          {project.contributors?.length ? (
            project.contributors.map((uid: string) => <BadgeUser key={uid} uid={uid} />)
          ) : (
            <div className="text-sm text-gray-500">No contributors yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Small component to render user's name/email by uid (reads users/{uid}) */
function BadgeUser({ uid }: { uid: string }) {
  const [info, setInfo] = useState<{ name?: string; email?: string } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (!mounted) return;
        if (snap.exists()) setInfo(snap.data() as any);
        else setInfo({ name: uid });
      } catch (err) {
        setInfo({ name: uid });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [uid]);

  return (
    <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm">
      {info?.name ?? info?.email ?? uid}
    </div>
  );
}
