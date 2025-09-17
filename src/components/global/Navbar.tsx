import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ButtonLink } from "./UI/ButtonLink";
import { Icon } from "./UI/Icon";
import { useState } from "react";

// A header of the app where main links are . included in ../App.tsx
export default function Navbar (){
    const {currentUser, signout}= useAuth();
    const [isMobileNavActive, setMobileNavActive] = useState(false);
    return (
        <header className="bg-white border-b border-gray-200 p-5 flex items-center justify-between gap-5 sticky top-0">
            <Link to={`/`} className="logo inline-flex gap-3 justify-center items-center">
                <img src="/K.png" alt="" className="w-12 h-12" />
                <div className="text-3xl font-extrabold text-gray-600 max-sm:hidden">KOMITI</div>
            </Link>
            <div className="links flex items-center flex-1 justify-end">
                <ul className={`${currentUser ? `hidden`: `flex`} list-none items-center space-x-4 max-sm:hidden`}>
                    <li className="list-item px-3">
                        <Link to="#" className="text-gray-600 font-medium text-sm hover:underline py-2">How It Works</Link>
                    </li>
                    <li className="list-item px-3">
                        <Link to="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Integrations</Link>
                    </li>
                    <li className="list-item px-3">
                        <Link to="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Team</Link>
                    </li>
                    <li className="list-item px-3">
                        <Link to="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Docs</Link>
                    </li>
                </ul>
                <div className={`items-center justify-center relative gap-3 ${currentUser ? `flex`: `hidden`}`}>                    
                    <button
                        type="button"
                        onClick={() => {setMobileNavActive(!isMobileNavActive)}}
                        className="h-11 w-11 font-extrabold flex items-center justify-center bg-gradient-to-br from-green-400 to-yellow-400 cursor-pointer rounded-full"
                    >
                        <div className="bg-transparent hover:bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                            <div className="text-transparent bg-gradient-to-br from-green-600 to-yellow-600 bg-clip-text">
                                {currentUser?.displayName || "NH"}
                            </div>
                        </div>
                    </button>

                    {isMobileNavActive && (
                        <div className="absolute top-full mt-1 rounded-md mx-auto border border-gray-300 bg-white shadow-lg transform rotate-45 h-7 w-7" />
                    )}
                    
                    {/* the real menu opener */}
                    {isMobileNavActive && (                        
                        <div className="absolute top-full mt-3 z-30 min-w-50 overflow-hidden border border-gray-300 bg-white rounded-2xl shadow-lg grid grid-col1-1">
                            <div className="menu-modal-header p-4 border-b border-gray-200">
                                <button type="button" className="h-10 w-10 font-extrabold flex items-center justify-center bg-gradient-to-br from-green-400 to-yellow-400 cursor-pointer rounded-full">
                                    <div className="bg-gray-100 hover:bg-gray-200 h-9 w-9 rounded-full flex items-center justify-center">
                                        <div className="text-transparent bg-gradient-to-br from-green-400 to-yellow-400 bg-clip-text">
                                            {currentUser?.displayName || "NH"}
                                        </div>
                                    </div>
                                </button>
                                <div className="flex flex-col items-start justify-start pt-1 text-sm text-gray-700">
                                    <h1 className="title fontbold">{currentUser?.displayName || "Ndanga Heritier"}</h1>
                                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                </div>
                            </div>
                            <div className="links grid grid-cols-1 gap-0.5 border-b border-b-gray-200 bg-gray-50">
                                <div className="link-item">
                                    <Link to={'/dashboard'} className="flex text-sm items-center justify-start gap-2 hover:bg-gray-200 duration-400 py-2 px-4">
                                        <Icon name="Grid2X2" size={16} strokeWidth={2} className="text-gray-500" />
                                        Dashboard
                                    </Link>
                                </div>
                                <div className="link-item">
                                    <Link to={'/contribute'} className="flex text-sm items-center justify-start gap-2 hover:bg-gray-200 duration-400 py-2 px-4">
                                        <Icon name="FolderOpen" size={16} strokeWidth={2} className="text-gray-500" />
                                        Projects
                                    </Link>
                                </div>
                                <div className="link-item">
                                    <Link to={'/integrate'} className="flex text-sm items-center justify-start gap-2 hover:bg-gray-200 duration-400 py-2 px-4">
                                        <Icon name="GitCompare" size={16} strokeWidth={2} className="text-gray-500" />
                                        Integrate
                                    </Link>
                                </div>
                                <div className="link-item">
                                    <Link to={'/settings'} className="flex text-sm items-center justify-start gap-2 hover:bg-gray-200 duration-400 py-2 px-4">
                                        <Icon name="Settings" size={16} strokeWidth={2} className="text-gray-500" />
                                        Settings
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-1">
                                <button 
                                    type="button"
                                    onClick={signout}
                                    className="px-4 group py-2 bg-red-500/5 text-red-600 flex items-center justify-center gap-1 duration-400 hover:bg-red-500/10 cursor-pointer"
                                >
                                    Logout
                                    <Icon name="ArrowRight" size={15} className="group-hover:flex hidden" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="ctas flex space-x-5 items-center justify-center">
                {/* here is to check if a user has logged in to add a profile and other link else display login link instead */}
                {currentUser ? (
                    <ButtonLink text="Contribute"  href="/contribute" />
                ):(
                    <ButtonLink href="/login" text="Get Started" variant="green" />
                )}
            </div>
        </header>
    )
}