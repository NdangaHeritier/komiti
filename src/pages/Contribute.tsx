
import { ButtonLink } from "../components/global/UI/ButtonLink"
import CreateProject from "../components/createProject";
export default function Contribute() {
    return (
        <section className="min-h-screen flex  justify-start bg-gray-50 p-5  w-full">
            <div className="flex items-left justify-start p-3 flex-col  w-full ">
                <h1 className="text-xl font-bold text-zinc-800  ">
                    Recent Commited Projects
                    </h1>
                  {/* here is to map through the projects that has been commited */}
                    <div className="project-details p-6 border 
                    border-zinc-100 rounded-lg shadow-md w-full bg-white">
                      <ul>
                        <li className="border-b border-zinc-200 py-2">
                            <div className="flex justify-between">
                               <h2 className="text-xl font-bold text-zinc-800">Ishuri: VMS Manager</h2>
                                <ButtonLink href="/project-details" variant="primary" text="Open Project" >
                                 
                                </ButtonLink>
                            </div>

                          <div className="flex gap-10 my-5">
                            <p className=" flex gap-2"> 2K <span className="text-gray-600 ">Registred commits</span></p>
                            <p className="flex gap-2">1.4K <span className="text-gray-600 ">Commits</span></p>
                            
                          </div>
                         
                        </li>
                        <li className="border-b border-zinc-200 py-2">
                         <div className="flex justify-between mt-3">
                               <h2 className="text-xl font-bold text-zinc-800">Formo: WithFormo Dashboard </h2>
                                <ButtonLink href="/project-details" variant="primary" text="Open Project" >
                                 
                                </ButtonLink>
                            </div>
                          <div className="flex gap-10 my-5">
                            <p className=" flex gap-2"> 12.5K <span className="text-gray-600 ">Registred commits</span></p>
                            <p className="flex gap-2">1.4K <span className="text-gray-600 ">Commits</span></p>
                            
                          </div>
                        </li>
                      </ul>
                    </div>
                    <CreateProject />

                   
                </div>
        </section>
    )
}