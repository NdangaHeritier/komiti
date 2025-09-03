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

export default function CreateProject() {
  const {currentUser} = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
      
  const handleCreateProject= async (data: { projectName: string; description: string }) => {

    if (!currentUser) {
      toast.error("You must be logged in to create a project");
      navigate("/login");
      return;
    }
    if (!data.projectName || !data.description) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
    await addDoc(collection(db, "projects"), {
        name: data.projectName,
        description: data.description,
        createdBy: currentUser?.uid,
        createdOn: new Date(),
        contributors: [currentUser?.uid],
        repoLink: "",
        branches: ["main"],
    });
    toast.success("Project created successfully");
    
    } catch (error) {
    console.error("Firestore error:", error);
    toast.error("Failed to create project");
    
    }
    finally {
      setOpen(false); // Close the modal after submission
    }
  };

    return (
        <div className="flex justify-center md:py-10 w-full flex-col gap-4">     
            
            <div className="flex items-center justify-between w-full ">
              <h1 className="text-sm text-zinc-600 uppercase">Your Projects</h1>
              <div>
                    <FormButton text="New Project" type="button" onClick={() => setOpen(true)} />
              </div>
                        <Modal open={open} onClose={() => setOpen(false)} onSubmit={handleCreateProject} />

                      </div>
                <div className="project-details border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-gray-200 grid grid-cols-1 gap-[1px] w-full list-none">
                      <li className="grid grid-cols-1 gap-2 p-5 bg-white">
                        <div className="flex justify-between items-center">
                            <Link to="/project/go-ship" className="text-base font-semibold text-zinc-800 hover:underline">
                              <h2 className="font-semibold text-zinc-800">Ishuri: VMS Manager</h2>
                            </Link>
                            <div className="inline-flex items-center gap-2">
                              <ButtonLink size="md" href="/project/go-ship" variant="secondary" text="Manage" />
                              <ButtonLink size="md" href="/project/go-ship" variant="primary" text="Open" />
                            </div>
                        </div>

                        {/* github repo link */}
                        <p className="text-sm text-gray-700">
                          <a href="https://github.com/NdangaHeritier/ishuri-vms" className="py-0.5 px-2 inline-flex items-center justify-center rounded-full hover:bg-gray-200 bg-gray-100 text-xs" target="_blank" rel="noopener noreferrer">
                            <Icon name="Github" className="w-3 h-3 inline-block mr-1" strokeWidth={3}/>
                            <span className="">github.com/NdangaHeritier/ishuri-vms</span>
                          </a>
                        </p>

                        <div className="flex gap-10 text-xs">
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="GitCommit" className="w-4 h-4" strokeWidth={2}/>
                            200
                            <span>Registred commits</span>
                          </p>
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="Users" className="w-3 h-3" strokeWidth={2}/>
                            3
                            <span>Contributors</span>
                          </p> 
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="GitBranch" className="w-3 h-3" strokeWidth={2}/>
                            last commited 2 days ago on
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full hover:bg-gray-200 flex items-center gap-1">
                              <Icon name="GitBranch" className="w-3 h-3" strokeWidth={3}/>
                              Main
                            </span>
                          </p>                          
                        </div>
                        
                      </li>
                      
                      <li className="grid grid-cols-1 gap-2 p-5 bg-white">
                        <div className="flex justify-between items-center">
                            <Link to="/project/go-ship" className="text-base font-semibold text-zinc-800 hover:underline">
                              <h2 className="font-semibold text-zinc-800">Formo: Adding Spam Detection and Filtering</h2>
                            </Link>
                            <div className="inline-flex items-center gap-2">
                              <ButtonLink size="md" href="/project/formo-add" variant="secondary" text="Manage" />
                              <ButtonLink size="md" href="/project/formo-add" variant="primary" text="Open" />
                            </div>
                        </div>

                        {/* github repo link */}
                        <p className="text-sm text-gray-700">
                          <a href="https://github.com/NdangaHeritier/formo" className="py-0.5 px-2 inline-flex items-center justify-center rounded-full hover:bg-gray-200 bg-gray-100 text-xs" target="_blank" rel="noopener noreferrer">
                            <Icon name="Github" className="w-3 h-3 inline-block mr-1" strokeWidth={3}/>
                            <span className="">github.com/NdangaHeritier/formo</span>
                          </a>
                        </p>

                        <div className="flex gap-10 text-xs">
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="GitCommit" className="w-4 h-4" strokeWidth={2}/>
                            12
                            <span>Registred commits</span>
                          </p>
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="Users" className="w-3 h-3" strokeWidth={2}/>
                            1 (you)
                            <span>Contributors</span>
                          </p> 
                          <p className=" flex gap-2 items-center justify-start gap-1 text-gray-600">
                            <Icon name="GitBranch" className="w-3 h-3" strokeWidth={2}/>
                            last commited 2 hours ago on
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full hover:bg-gray-200 flex items-center gap-1">
                              <Icon name="GitBranch" className="w-3 h-3" strokeWidth={3}/>
                              non-developer
                            </span>
                          </p>                          
                        </div>
                        
                      </li>
                    </div>
        </div>
    );
}