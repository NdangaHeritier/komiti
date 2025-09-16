import { FormButton } from "./global/forms/Button";
import { ButtonLink } from "./global/UI/ButtonLink"
import Modal from "./global/forms/create_project_modal";
import { useState } from "react";
import { db } from "../utils/db";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { Icon } from "./global/UI/Icon";
import { Link, useNavigate } from "react-router-dom";
import type { Project } from "../utils/mainTypes";
import daysAgo from "../utils/fetchDays";

export default function CreateProject({ownedProjects, loading, afterCreate}: {ownedProjects: Project[], loading: Boolean, afterCreate: () => void}) {
  const {currentUser, currentTeam} = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
      
  const handleCreateProject= async (data: { projectName: string; description: string, branch: string[], repoLink: string }) => {

    if (!currentUser) {
      toast.error("You must be logged in to create a project");
      navigate("/login");
      return;
    }
    if (!data.projectName || !data.repoLink) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
    const newProject = await addDoc(collection(db, "projects"), {
        name: data.projectName,
        description: data.description,
        createdBy: currentUser.uid,
        createdOn: new Date(),
        contributors: [currentUser.uid],
        team: currentTeam.id,
        repoLink: data.repoLink,
        branches: data.branch,
    });
    if (newProject){
      await addDoc(collection(db, "Commits"), {
        commitId: "CRT"+data.projectName.substring(0,2).toUpperCase(),

        projectId: newProject.id,
        branch: "Main",
        title: `Created ${data.projectName} project.`,
        message: `Added first commit on ${data.projectName} on ${new Date()} .`,
        status: "verified",
        user: {uid: currentUser.uid, name: currentUser?.displayName || "admin"},
        createdOn: new Date(),
        verificationLink: data.repoLink
      });
    }
    toast.success("Project created successfully");
    
    } catch (error) {
    console.error("Firestore error:", error);
    toast.error("Failed to create project");
    
    }
    finally {
      setOpen(false); // Close the modal after submission
      afterCreate();
    }
  };

  const projects = ownedProjects;

    return (
        <div className="flex justify-center md:py-10 w-full flex-col gap-4">     
            
            <div className="flex items-center justify-between w-full ">
              <h1 className="text-sm text-zinc-600 uppercase">Your Projects</h1>
              <div>
                    <FormButton variant="secondary" text="New Project" type="button" onClick={() => setOpen(true)}>
                      <Icon name="CirclePlus" size={16} strokeWidth={2} />
                      New Project                      
                    </FormButton>
              </div>
              <Modal open={open} onClose={() => setOpen(false)} onSubmit={handleCreateProject} />

              </div>
                {loading && (
                  <div className="w-full rounded bg-white border border-gray-200 min-h-80 flex items-center justify-center">
                    <Icon name="Loader2" strokeWidth={2} className="w-6 h-6 text-gray-600 animate-spin" />
                  </div>
                )}
                {/* here is to map through the projects that has been commited */}
                <div className={`${loading ? `hidden` : ``} project-details border border-zinc-200 rounded overflow-hidden shadow-xs bg-gray-200 grid grid-cols-1 gap-[1px] w-full list-none`}>
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <li key={index} className="grid grid-cols-1 gap-2 px-5 py-4 bg-white">
                        <div className="flex justify-between items-center">
                            <Link to="/project/go-ship" className="text-base font-semibold text-zinc-800 capitalize">
                              <h2 className="font-semibold text-zinc-800">{project.name}</h2>
                            </Link>
                            <ButtonLink href={`/${currentTeam?.name.replaceAll(" ", "_")}/${project.id}`} variant="secondary" size="sm" >
                              <Icon name="Settings" size={17} strokeWidth={2} />
                            </ButtonLink>
                        </div>
        
                        {/* github repo link */}
                        <p className="text-sm text-gray-700">
                          <a href={project.repoLink} className="py-0.5 px-2 inline-flex items-center justify-center rounded-full hover:bg-gray-200 bg-gray-100 text-xs" target="_blank" rel="noopener noreferrer">
                            <Icon name="Github" className="w-3 h-3 inline-block mr-1" strokeWidth={3}/>
                            <span className="">{project.repoLink.substring(7)}</span>
                          </a>
                        </p>
        
                        <div className="flex max-sm:flex-wrap gap-x-6 gap-y-2 sm:gap-x-10 text-xs">
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
                            <span className="bg-gray-100 border border-gray-200 font-mono px-2 py-0.5 rounded-full hover:bg-gray-200 flex items-center gap-1">
                              <Icon name="GitBranch" className="w-3 h-3" strokeWidth={3}/>
                              {project.latestCommit?.branch}
                            </span>
                          </p>                          
                        </div>
                        
                      </li>
                    ))
                  ):(
                    <p className="text-sm p-5 min-h-80 bg-white rounded-md text-gray-600 font-mono">No projects committed found!</p>
                  )}
                </div>
        </div>
    );
}