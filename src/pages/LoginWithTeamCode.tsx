import { useState } from "react";
import { FormButton } from "../components/global/forms/Button";
import { Input } from "../components/global/forms/inputField";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/db";
import { useAuth } from "../context/useAuth"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginWithTeamCode (){

    const {setCurrentTeam, currentTeam} = useAuth();
    const [teamCode, setTeamCode] = useState(currentTeam?.code || "");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // // if team is already set redirect to login page
    // if (currentTeam) {
    //     navigate("/login");
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamCode) {
            toast.error("Please enter a team code");
            return;
        }
        setLoading(true);

        try {
            const teamRef = collection(db, "teams");
            const teamQuery = query(teamRef, where("code", "==", teamCode));
            const teamSnapshot = await getDocs(teamQuery);
            if (teamSnapshot.empty) {
                toast.error("Invalid team code");
                console.log("No team found with code:", teamCode);
                return;
            }
            setCurrentTeam(teamSnapshot.docs[0].data());
            toast.success("Team code accepted, please login");
            navigate("/login");
            console.log("Team Code submitted:", teamCode);
        }
        catch (error) {
            toast.error("Error fetching team data");
            console.error("Error fetching team data:", error);
            return;
        }
        finally {
            setLoading(false);
        }    
        
    };
    return (
        <section className="flex items-center justify-center p-5">
            <div className="rounded-2xl border border-gray-300 bg-white shadow-sm p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-5 text-center">Login with Team Code</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700">Enter your Team Code</label>
                        <Input id="teamCode" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} name="teamCode" type="password" placeholder="* * * * * *" />
                        <FormButton text="Login" type="submit" disabled={loading} />
                    </div>
                    <div className="grid grid-cols-1">
                        
                    </div>
                </form>                
            </div>
        </section>
    )
}