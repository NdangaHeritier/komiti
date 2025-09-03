
import { ButtonLink } from "../components/global/UI/ButtonLink"
import CreateProject from "../components/createProject";
import { Icon } from "../components/global/UI/Icon";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
export default function Contribute() {

  const {currentUser} = useAuth();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState<Boolean>(false);

  useEffect(()=>{
    setAuthLoading(true)
    if(!currentUser){
      navigate("/login");
      return;
    }
    setAuthLoading(false);
  }, [navigate, currentUser]);
  return (
    <section className="min-h-screen flex  justify-start p-5  w-full">
      <div className="flex items-left justify-start p-3 flex-col  w-full gap-4">
        <h1 className="text-sm text-zinc-600 uppercase">
          Recent Commited Projects
        </h1>
        {authLoading && (
          <div className="w-full rounded-md bg-white border-gray-200 min-h-100 flex items-center justify-center">
            <Icon name="Loader" strokeWidth={2} className="w-6 h-6 text-gray-600 animate-spin" />
          </div>
        )}
        {/* here is to map through the projects that has been commited */}
        <div className={`${authLoading ? `hidden` : ``} project-details border border-zinc-200 rounded-lg overflow-hidden shadow-sm bg-gray-200 grid grid-cols-1 gap-[1px] w-full list-none`}>
          <li className="grid grid-cols-1 gap-2 p-5 bg-white">
            <div className="flex justify-between items-center">
                <Link to="/project/go-ship" className="text-base font-semibold text-zinc-800 hover:underline">
                  <h2 className="font-semibold text-zinc-800">Ishuri: VMS Manager</h2>
                </Link>
                <ButtonLink href="/project-details" variant="primary" text="Open Project" />
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
                <ButtonLink href="/project-details" variant="primary" text="Open Project" />
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
        <CreateProject />                
      </div>
    </section>
  )
}