import { useEffect, useState } from "react";
import { Icon } from "../global/UI/Icon";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../utils/db";
import type { Commit } from "../../utils/mainTypes";
import daysAgo from "../../utils/fetchDays";
import { ButtonLink } from "../global/UI/ButtonLink";

type CommitType = Commit & {
    projectName: string
}
export default function RecentCommitsCard (){

    const [loading, setLoading] = useState(true);
    const [commits, setCommits] = useState<CommitType[]>([]);
    const { currentTeam, currentUser } = useAuth();

    const fetchRecentCommits = async () => {
        if (!currentUser || !currentTeam){
            toast.error("UnAutholized!");
            return;
        }
        try{
            const docref = collection(db, "projects");
            const projectsQ = query(
                docref,
                where("contributors", "array-contains", currentUser.uid),
                where("team", "==", currentTeam.id)
            );

            const projecsSnap = await getDocs(projectsQ);

            if(!projecsSnap.empty){
                const projectIds= projecsSnap.docs.map((doc) => (doc.id));
                const projects: Record<string, any> = {};
                projecsSnap.docs.forEach(doc => {
                    projects[doc.id] = doc.data();
                });


                // fetch recent commits..
                const commitsRef = collection(db, "Commits");
                const commitsQ = query(commitsRef,
                    where("projectId", "in", projectIds),
                    orderBy("createdOn", "desc"),
                    limit(6)
                );
                const commitsSnap = await getDocs(commitsQ);
                if (!commitsSnap.empty){
                    setCommits(commitsSnap.docs.map(commit => ({
                        id: commit.id,
                        ...commit.data(),
                        createdOn: commit.data().createdOn.toDate(),
                        projectName: projects[commit.data()?.projectId]?.name
                    } as CommitType)));
                }
            }

        }catch(error){
            toast.error("Error occured while fetching data. try reload for fix.");
            console.error("firebase firestore serro, ", error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecentCommits();
    }, [currentUser]);

    if (loading){
        return(
            <div className="h-full flex-1/3 bg-white border border-gray-200 flex items-center justify-center rounded">
              <Icon name="Loader2" strokeWidth={2} className="w-6 h-6 text-gray-600 animate-spin min-h-80" />
            </div>
        )
    }

    return(
        <div className={`sm:h-full w-full sm:flex-2/5 bg-white border border-gray-200 rounded`}>
            <div className="p-4 uppercase text-gray-600 text-sm border-b border-gray-200 flex items-center justify-between gap-4">
                <span className="">Recent commits</span>
                <button className="h-7 w-7 inline-flex items-center justify-center hover:bg-gray-100 cursor-pointer rounded">
                    <Icon name="Filter" size={18} />
                </button>
            </div>
            {commits.length > 0 ? (
                <div className="grid grid-cols-1 gap-[1px] bg-gray-200">
                    {commits.map((commit, index) => (
                        <div className="px-3 py-2 grid grid-cols-1 gap-1 bg-white hover:bg-gray-50 cursor-pointer" key={index}>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center justify-start gap-2">
                                    <Icon name="GitCommit" size={18} className="text-green-500" strokeWidth={2}/>
                                    <span className="text-xs font-['Geist Mono', monospace] px-1 border border-gray-200 bg-gray-100 font-semibold text-gray-600 rounded">
                                        {commit.projectName}
                                    </span>
                                </div>
                                <button className="h5 w-5 cursor-pointer flex items-center text-gray-600 rounded hover:bg-gray-100 justify-center">
                                    <Icon name="MoreHorizontal" size={15} strokeWidth={2} />
                                </button>
                            </div>
                            <p className="text-sm font-medium text-gray-800">{commit.title} ~ {commit?.message?.substring(0, 10)} ..</p>
                            <div className="text-gray-600 flex items-center justify-between gap-2">
                                <ButtonLink size="sm" text={`#${commit?.commitId || `CRE43RT${index}`}`} href={commit?.verificationLink} />                              
                                <p className="text-sm text-end">
                                    Added by <span className="font-semibold">{commit.user?.name}</span> {daysAgo(commit?.createdOn)}d ago on 
                                    <code className="px-1">
                                        <Icon name="GitBranch" size={16} className="pe-1 inline-flex" strokeWidth={2} />
                                        {commit.branch}
                                    </code>
                                </p>
                            </div>                            
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm font-mono p-5">No recent commits.</p>
            )}
        </div>
    )
}