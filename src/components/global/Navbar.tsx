import { useAuth } from "../../context/useAuth";
import { FormButton } from "./forms/Button";
import { ButtonLink } from "./UI/ButtonLink";

// A header of the app where main links are . included in ../App.tsx
export default function Navbar (){
    const {currentUser, signout}= useAuth();
    return (
        <header className="bg-gray-100 p-5 flex items-center justify-between gap-5 sticky top-0">
            <div className="logo inline-flex gap-3 justify-center items-center">
                <span className="text-3xl border-3 border-gray-100 ring-3 ring-gray-300 rounded-md bg-gray-300 font-bold p-1 w-12 h-12 flex items-center justify-center">
                    K
                </span>
                <div className="text-3xl font-extrabold text-gray-600">KOMITI</div>
            </div>
            <div className="links flex items-center flex-1 justify-end">
                <ul className={`${currentUser ? `hidden`: `flex`} list-none items-center space-x-4 max-sm:hidden`}>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Home</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">About</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">How It Works</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Integrations</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Team</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Get Started</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">Docs</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline py-2">?Help</a>
                    </li>
                </ul>
                <div className={`items-center justify-center gap-3 ${currentUser ? `flex`: `hidden`}`}>
                    <span className="text-gray-600 font-medium text-sm flex gap-1">Hello, <span>{currentUser?.email?.split("@")[0]}</span></span>
                    <FormButton type="button" text="Logout" variant="secondary" onClick={() => {
                        signout();
                        window.location.reload();
                    }} />
                </div>
            </div>
            <div className="ctas flex space-x-5 items-center justify-center ps-6">
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