import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../utils/db";
import { useAuth } from "../context/useAuth";
import type  {Project}  from "../utils/mainTypes";
import { Home, Plus } from "lucide-react";

export default function Sidebar (){
    const [loading, setLoading] = useState(true);
    const { currentUser, currentTeam } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeLink, setActiveLink] = useState('umu');
    const navigate = useNavigate();
    const getProjects = async () => {
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
            const pros = projectsSnap.docs.map(p => ({id: p.id, ...p.data()} as Project));
            setProjects(pros);
        }
        catch(err){
            console.error("you're cooked 😁😋", err);
            toast.error("error fetching projects!");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!currentTeam || !currentUser){
            navigate('/login');
            return;
        }
        getProjects();
    }, [navigate, currentTeam, currentUser]);

    const colors = [
        'bg-blue-500 hover:bg-blue-600 border-2 ring-2 ring-blue-500 border-white text-white/70',
        'bg-green-500 hover:bg-green-600 border-2 ring-2 ring-green-500 border-white text-white/70',
        'bg-pink-500 hover:bg-pink-600 border-2 ring-2 ring-pink-500 border-white text-white/70',
        'bg-indigo-500 hover:bg-indigo-600 border-2 ring-2 ring-indigo-500 border-white text-white/70',
        'bg-yellow-500 hover:bg-yellow-600 border-2 ring-2 ring-yellow-500 border-white text-white/70',
        'bg-sky-500 hover:bg-sky-600 border-2 ring-2 ring-sky-500 border-white text-white/70',
        'bg-violet-500 hover:bg-violet-600 border-2 ring-2 ring-violet-500 border-white text-white/70',
        'bg-gray-500 hover:bg-gray-600 border-2 ring-2 ring-gray-500 border-white text-white/70',

    ]
    return (
        <div className="bg-white p-1 flex flex-col shadow h-screen">
            <div className="logo flex items-start py-3 px-0 sm:px-3 justify-center">
                <Link to={'/'} className="" >
                    <img src="/K.png" alt="" className="h-16 w-16" />
                </Link>
            </div>
            <div className="flex justify-center items-center">
                <Link to={'/contribute'} className={`${activeLink == '' ? `bg-gray-700 hover:bg-gray-950 text-white` : `bg-gray-100 hover:bg-gray-200 text-gray-700`} rounded-xl h-12 w-12 flex items-center justify-center`}>
                    <Home className="" />
                </Link>
            </div>
            {loading && (
                <div className="flex items-center flex-col justify-center gap-3 grid-cols-1 p-0 sm:p-3 flex-1">
                    <span className="rounded-xl w-12 h-12 bg-gray-200 animate-pulse"></span>
                    <span className="rounded-xl w-12 h-12 bg-gray-100 animate-pulse"></span>
                    <span className="rounded-xl w-12 h-12 bg-gray-200 animate-pulse"></span>
                    <span className="rounded-xl w-12 h-12 bg-gray-100 animate-pulse"></span>
                </div>
            )}
            <div className="flex flex-col items-center flex-1 overflow-auto justify-start gap-3 px-0 py-3 sm:px-3">
                {/* loop over projects buttons */}
                {projects.length > 0 && !loading && (
                    projects.map((p, index) => (
                        <Link to={`${currentTeam.name}/manage/${p.id}`} key={index} className={`h-12 w-12 ${activeLink == p.name ? colors[index] : `text-gray-400 bg-gray-100 border border-gray-200`} font-bold text-xl flex items-center justify-center rounded-xl`}>
                            {p.name.toUpperCase().substring(0, 1)}
                        </Link>
                    ))
                )}
                <Link to={'/contribute'} className="bg-gray-900 hover:bg-gray-950 rounded-full h-12 w-12 flex items-center justify-center">
                    <Plus className="text-white" />
                </Link>
            </div>
        </div>
    )
}