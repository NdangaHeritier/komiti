import { useState } from "react";
import { Input } from "../components/global/forms/inputField";
import { FormButton } from "../components/global/forms/Button";
import { useNavigate } from "react-router-dom";

export default function Login () {
    const [authInfo, setAuthInfo] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setAuthInfo({...authInfo, [e.target.name]: e.target.value});

    }

    // Handle submit on login to set user in Auth context.
    // remember in useAuth is a custom hook to handle all Auth action(signin, signout, loading and even profile updation.)
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate("/dashboard")
        // login here when i have mbs i will implement it forsure
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full p-10">
            <section className="login-div max-w-96 min-w-96 grid grid-cols-1 gap-5">
                {/* Here is a simple implemented login header logo on card. */}
                <div className="header flex items-center justify-start gap-5">
                    <span className="text-4xl border-3 border-gray-100 ring-3 ring-gray-300 rounded-md bg-gray-300 font-bold p-1 w-15 h-15 flex items-center justify-center">
                        K
                    </span>
                    <div className="text-base text-gray-700">
                        <h4 className="font-bold text-4xl">Komiti Signin</h4>
                        <p className="font-medium">Signin to start manage your contributions</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} method="post" className="grid grid-cols-1 gap-5 w-full">
                    {/* Adding form elements using reusable components for inputs, textarea, ... for easy reusable and one update and handle all. */}
                    <Input name="email" type="email" onChange={handleChange} value={authInfo.email}  />
                    <Input name="password" type="password" onChange={handleChange} value={authInfo.password} />
                    <FormButton text="Login" type="submit" />
                </form>
            </section>
        </div>
    )
}