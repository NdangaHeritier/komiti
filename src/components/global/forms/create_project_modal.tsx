import React, { useState } from "react";
import { Input } from "./inputField";
import {FormButton} from "./Button";
import { X } from "lucide-react";
import { TextArea } from "./textAreafield";
import toast from "react-hot-toast";
type ModalProps = {
    open: boolean,
    onClose: () => void,
    onSubmit: (data: {projectName: string, description: string, branch: string[], repoLink: string }) => void;


};


export default function Modal({ open, onClose, onSubmit }: ModalProps) {

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [rawBranch, setRawBranch] = useState("");
  const [branch, setBranch] = useState<string[]>([]);
  const [repoLink, setRepoLink] = useState("");
  const [loading, setLoading] = useState(false);
  if (!open) 
    return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if(projectName == "" || repoLink == ""){
        toast.error("title and repository link are required.");
        return;
    }
    if(rawBranch.trim() == ""){
        setBranch(["Main"]);
    }
    else{
        setBranch(rawBranch.split(",").map(b => b.trim()));
    }
    onSubmit({projectName, description, branch, repoLink});
    setProjectName("");
    setDescription("");
    onClose();
    setLoading(false);

  };

    return (
         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-xs p-5">
             <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-8 w-full max-w-lg  overflow-auto max-h-screen">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold text-zinc-800 pb-3">Create New Project</h1>
                    <button
                        type="button"
                        className="text-zinc-600 hover:text-zinc-800 font-bold hover:bg-gray-100 h-10 w-10 flex items-center justify-center"
                        onClick={onClose}>
                        <X size={25}  className="font-bold"/>
                    </button>
                </div>
                
                <form className="w-full max-w-full mt-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-zinc-700">Project Name</span>
                            <Input type="text" name="projectName" placeholder="ie: Agriculture Assistant App" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-zinc-700">Add Github/ GItLab repo link:</span>
                            <Input type="url" name="description" placeholder="https://github.com/userName/my-repo/" value={repoLink} onChange={(e) => setRepoLink(e.target.value)} />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-zinc-700">Description</span>
                            <TextArea
                                name="description"
                                cols={5}
                                rows={5}
                                value={description} onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-zinc-700">
                                (leave it empty if its only Main branch)
                                <span className="text-green-600 px-2">Add your repo branches like <b className="font-mono font-bold">Main, Front-end, Backend, newFeature,..</b></span>
                            </span>
                            <Input type="text" name="branches" placeholder="ie: Main, newBranch, other_branch,.." value={rawBranch} onChange={(e) => setRawBranch(e.target.value)} />
                        </label>

                    </div>
                    <div className="mt-6">
                        <FormButton type="submit"  text="Create Project" disabled={loading}/>
                    </div>
                </form>
            </div>
        </div>
    )
}