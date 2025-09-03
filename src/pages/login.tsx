import { useEffect, useState } from "react";
import { Input } from "../components/global/forms/inputField";
import { FormButton } from "../components/global/forms/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

export default function Login () {
    const [authInfo, setAuthInfo] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentTeam, signin, currentUser } = useAuth();

    useEffect(()=>{
        // if user is already logged in redirect to dashboard
        if (currentUser) {
            navigate("/dashboard");
        }

        // check if there's active team set in context if not redirect to team code login page.
        
        if (!currentTeam) {
            navigate("/team-code-login");
        }
    }, [navigate, currentUser]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setAuthInfo({...authInfo, [e.target.name]: e.target.value});

    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentTeam) {
           toast.error("Please enter your team code first");
            navigate("/team-code-login");
            return;
        }
        setLoading(true);
        try{
            await signin(authInfo.email, authInfo.password);
            toast.success("Login successful");
            navigate("/dashboard");
        }
        catch (error){
            toast.error("Login failed, please check your credentials");
            console.error("Login error:", error);
            return;
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className="" style={{backgroundImage: `url('/${currentTeam?.image || 'team_avatar.svg'}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <div className="h-full w-full bg-gradient-to-b from-gray-100 to-gray-100/30 min-h-screen flex items-center justify-center w-full p-2 sm:p-10">
                <section className={`login-div max-w-full sm:max-w-1/2 grid grid-cols-1 gap-5 bg-white shadow-md rounded-2xl p-10`}>
                    {/* Here is a simple implemented login header logo on card. */}
                    <div className="header flex items-start sm:items-center justify-start max-sm:flex-col gap-5">
                        <div className="thumbnail flex items-center justify-center">
                            <div className="w-14 h-14 flex items-center justify-center bg-gray-500 rounded-md p-0.5 overflow-hidden">
                                <img src={`/${currentTeam?.image || 'team_avatar.svg'}`} alt="" className="w-full h-full object-fit" />
                            </div>
                        </div>
                        <div className="text-base text-gray-700">
                            <h4 className="text-xl text-gray-500">Welcome back to,</h4>
                            <h2 className="font-extrabold text-4xl capitalize">{currentTeam?.name || "No Team"}</h2>
                        </div>
                    </div>
                    <p className="font-medium text-xs text-gray-500 p-2 text-center border-b border-t border-gray-200">
                        Signin to start manage your contributions.
                    </p>
                    <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 gap-5 w-full py-5">
                        {/* Adding form elements using reusable components for inputs, textarea, ... for easy reusable and one update and handle all. */}
                        <Input name="email" type="email" onChange={handleChange} value={authInfo.email}  />
                        <Input name="password" type="password" onChange={handleChange} value={authInfo.password} />
                        <FormButton text="Login" type="submit" disabled={loading} />
                    </form>
                </section>
            </div>
        </div>
    )
}