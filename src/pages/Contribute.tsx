
import { ButtonLink } from "../components/global/UI/ButtonLink"
import CreateProject from "../components/createProject";
import { Icon } from "../components/global/UI/Icon";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../utils/db";
import toast from "react-hot-toast";
import daysAgo from "../utils/fetchDays";
import type { Commit, Project } from "../utils/mainTypes";

export default function Contribute() {

  const {currentUser, currentTeam} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // fetch all projects with their commits..

  const fetchProjects = async () => {
    setLoading(true)
    try{
      const docRef = collection(db, "projects");
      const projectsQuery = query(
        docRef,
        where("contributors", "array-contains", currentUser.uid),
        where("team", "==", currentTeam.id)
      );
      const projectsSnap = await getDocs(projectsQuery);

      if (projectsSnap.empty) {
        setProjects([]);
        toast.error("no projects found.");
        setLoading(false);
        return;
      }

      // Fetch latest commit for each project
      const projectsWithCommit = await Promise.all(
        projectsSnap.docs.map(async (doc) => {
          const projectData = {
            createdOn: doc.data().createdOn.toDate(),
            ...doc.data()
          } as Omit <Project, "id" | "latestCommit" | "totalCommits">;

          const commitQuery = query(
            collection(db, "Commits"),
            where("projectId", "==", doc.id),
            orderBy("createdOn", "desc"),
            limit(1)
          );

          const commitSnap = await getDocs(commitQuery);
          const latestCommit = !commitSnap.empty ? ({ 
            id: commitSnap.docs[0].id,
            ...commitSnap.docs[0].data(),
            createdOn: commitSnap.docs[0].data().createdOn.toDate(),
          } as Commit) : null;

          const commitCountQuery = query(
            collection(db, "Commits"),
            where("projectId", "==", doc.id)
          );
          const countSnapshot = await getCountFromServer(commitCountQuery);
          const totalCommits = countSnapshot.data().count;

          return {
            id: doc.id,
            ...projectData,
            latestCommit,
            totalCommits
          };
        })
      );

      setProjects(projectsWithCommit);
    } catch (err) {
      toast.error("Error fetching projects, try refresh.")
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{    
    if(!currentUser){
      navigate("/login");
      return;
    }
    fetchProjects();
  }, [navigate, currentUser]);
  return (
    <section className="min-h-screen flex  justify-start p-5  w-full">
      <div className="flex items-left justify-start p-3 flex-col  w-full gap-4">
        <h1 className="text-sm text-zinc-600 uppercase">
          Recent Commited Projects
        </h1>
        {loading && (
          <div className="w-full rounded-md bg-black/6 animate-pulse border-gray-200 min-h-80 flex items-center justify-center">
            <Icon name="Loader2" strokeWidth={2} className="w-6 h-6 text-gray-600 animate-spin" />
          </div>
        )}
        {/* here is to map through the projects that has been commited */}
        <div className={`${loading ? `hidden` : ``} project-details border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-gray-200 grid grid-cols-1 gap-[1px] w-full list-none`}>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <li key={index} className="grid grid-cols-1 gap-2 p-5 bg-white">
                <div className="flex justify-between items-center">
                    <Link to="/project/go-ship" className="text-base font-semibold text-zinc-800 hover:underline">
                      <h2 className="font-semibold text-zinc-800">{project.name}</h2>
                    </Link>
                    <ButtonLink href="/project-details" variant="primary" text="Open Project" />
                </div>

                {/* github repo link */}
                <p className="text-sm text-gray-700">
                  <a href={project.repoLink} className="py-0.5 px-2 inline-flex items-center justify-center rounded-full hover:bg-gray-200 bg-gray-100 text-xs" target="_blank" rel="noopener noreferrer">
                    <Icon name="Github" className="w-3 h-3 inline-block mr-1" strokeWidth={3}/>
                    <span className="">{project.repoLink.substring(7)}</span>
                  </a>
                </p>

                <div className="flex gap-10 text-xs">
                  <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                    <Icon name="GitCommit" className="w-4 h-4" strokeWidth={2}/>
                    {project?.totalCommits || "none"}
                    <span>Registred commit(s)</span>
                  </p>
                  <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                    <Icon name="Users" className="w-3 h-3" strokeWidth={2}/>
                    {project?.contributors.length}
                    <span>Contributor(s)</span>
                  </p> 
                  <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                    <Icon name="GitBranch" className="w-3 h-3" strokeWidth={2}/>
                    last commited {daysAgo(project.latestCommit?.createdOn)} days ago on
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full hover:bg-gray-200 flex items-center gap-1">
                      <Icon name="GitBranch" className="w-3 h-3" strokeWidth={3}/>
                      {project.latestCommit?.branch}
                    </span>
                  </p>                          
                </div>
                
              </li>
            ))
          ):(
            <p className="text-sm p-10 bg-white m-0.5 rounded-md">No projects committed found!</p>
          )}
        </div>
        <CreateProject afterCreate={fetchProjects} loading={loading} ownedProjects={
          projects.filter(
            project => project.createdBy === currentUser.uid
          )
        } />                
      </div>
    </section>
  )
}