import { ButtonLink } from "./UI/LinkBtn";

// A header of the app where main links are . included in ../App.tsx
export default function Navbar ( {loggedIn = false}:{loggedIn?: boolean}){
    return (
        <header className="bg-gray-100 p-5 flex items-center justify-between gap-5">
            <div className="logo inline-flex gap-3 justify-center items-center">
                <span className="text-3xl border-3 border-gray-100 ring-3 ring-gray-300 rounded-md bg-gray-300 font-bold p-1 w-12 h-12 flex items-center justify-center">
                    K
                </span>
                <div className="text-3xl font-extrabold text-gray-600">KOMITI</div>
            </div>
            <div className="links flex items-center flex-1 justify-end">
                <ul className="list-none flex items-center space-x-4">
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Home</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">About</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">How It Works</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Integrations</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Team</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Get Started</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">Docs</a>
                    </li>
                    <li className="list-item px-3">
                        <a href="#" className="text-gray-600 font-medium text-sm hover:underline">?Help</a>
                    </li>
                </ul>
            </div>
            <div className="ctas flex space-x-5 items-center justify-center ps-6">
                {/* here is to check if a user has logged in to add a profile and other link else display login link instead */}
                {loggedIn ? (
                    <ButtonLink text="Contribute" />
                ):(
                    <ButtonLink href="/login" text="Contribute" variant="green" />
                )}
            </div>
        </header>
    )
}