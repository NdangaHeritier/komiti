import React, { useState } from "react";
import { Input } from "./inputField";
import {FormButton} from "./Button";
import { X } from "lucide-react";
type ModalProps = {
    open: boolean,
    onClose: () => void,
    onSubmit: (data: {projectName: string, description: string}) => void;


};


export default function Modal({ open, onClose, onSubmit }: ModalProps) {

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
   const [loading, setLoading] = useState(false);
  if (!open) 
    return null;
  const handleSubmit = (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    onSubmit({projectName, description});
    setProjectName("");
    setDescription("");
    onClose();
    setLoading(false);

  };

    return (
         <div className="fixed inset-0 flex items-center justify-center
          bg-black/40 z-50 backdrop-blur-xs p-5">
             <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-lg">
                <div className="flex justify-between">
                <h1 className="text-xl font-bold text-zinc-800 py-3">Create New Project</h1>
                <button type="button" className="text-zinc-600 hover:text-zinc-800 font-bold" onClick={onClose}>
                    <X size={25}  className="font-bold"/>
                </button>
                </div>
                
                <form className="w-full max-w-sm my-5 mx-auto" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-700">Project Name</span>
                            <Input type="text" name="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-700">Description</span>
                            <Input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </label>
                    </div>
                    <div className="my-6">
                        <FormButton type="submit"  text="Create Project" disabled={loading}/>
                    </div>
                </form>
            </div>
        </div>
    )
}