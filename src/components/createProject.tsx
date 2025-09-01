import { FormButton } from "./global/forms/Button";
import { ButtonLink } from "./global/UI/ButtonLink"
import Modal from "./global/forms/modal";
import { useState } from "react";
import { db } from "../utils/db";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";
import { MoreHorizontal } from "lucide-react";

export default function CreateProject() {
  const user = useAuth().currentUser;
       const [open, setOpen] = useState(false);
      
       const handleCreateProject= async (data: { projectName: string; description: string }) => {
          if (!data.projectName || !data.description) {
    toast.error("Please fill in all fields");
    return; // stop closing modal
          }
           try {
            await addDoc(collection(db, "projects"), {
                name: data.projectName,
                description: data.description,
                createdBy: user?.uid ?? "Anonymous",
                createdOn: new Date(),
            });
            toast.success("Project created successfully");
            
           } catch (error) {
            console.error("Firestore error:", error);
            toast.error("Failed to create project");
            
           }
       };

    return (
        <div className="min-h-screen flex  justify-center bg-gray-50 md:p-5   w-full flex-col ">
          
            
            <div className="flex items-center justify-between w-full ">
              <h1 className="text-xl font-bold text-zinc-800 my-2 py-2">My Projects</h1>
              <div>
                    < FormButton text="New Project" type="button" onClick={() => setOpen(true)} />
              </div>
                        <Modal open={open} onClose={() => setOpen(false)} onSubmit={handleCreateProject} />

                      </div>
                    <div className="project-details p-6 border 
                    border-zinc-100 rounded-lg shadow-md w-full bg-white">
                      
                      <ul>
                        <li className="border-b border-zinc-200 py-2">
                            <div className="flex justify-between">
                               <h2 className="text-xl font-bold text-zinc-800">Go-Ship</h2>
                                
                                <div className="md:flex gap-3 hidden ">
                                    <ButtonLink href="/project-details" variant="primary" text="Manage" />
                                <ButtonLink href="/manage" text="Open Project" variant="green" />
                                </div>
                                <div className=" md:hidden flex">
                                 <FormButton type="button" variant="secondary" text=""> 
                                  <MoreHorizontal size={20} />
                                 </FormButton>

                                </div>
                            </div>

                          <div className="flex gap-10 my-5">
                            <p className=" flex gap-2"> 2K <span className="text-gray-600 ">Registred commits</span></p>
                            <p className="flex gap-2">1.4K <span className="text-gray-600 ">Commits</span></p>
                            
                          </div>
                         
                        </li>
                        <li className="border-b border-zinc-200 py-2">
                         <div className="flex justify-between mt-3">
                               <h2 className="text-xl font-bold text-zinc-800">Formo: WithFormo Dashboard </h2>
                                <div className="flex gap-3">
                                    <ButtonLink href="/project-details" variant="primary" text="Manage" />
                                <ButtonLink href="/manage" text="Open Project" variant="green" />
                                </div>
                            </div>
                          <div className="flex gap-10 my-5">
                            <p className=" flex gap-2"> 12.5K <span className="text-gray-600 ">Registred commits</span></p>
                            <p className="flex gap-2">1.4K <span className="text-gray-600 ">Commits</span></p>
                            
                          </div>
                        </li>
                      </ul>
                    </div>

        </div>
    );
}