import { Link } from "react-router-dom";
import { Icon } from "../components/global/UI/Icon";

export default function Page404(){
    return(
        <section className="min-h-120 flex items-center justify-center p-0 sm:p-10">
            <div className="flex flex-col items-center justify-center p-3 gap-8">
                <img src="/logo.png" alt="" className="w-25 h-25" />
                <h2 className="text-4xl font-bold">404 Page</h2>
                <p className="text-gray-600 font-mono text-center">Looks like, you're lost on our world!</p>
                <Link to={'/'} className="px-4 py-3 rounded bg-gray-900 hover:bg-gray-950 duration-400 font-mono uppercase flex items-center justify-center gap-5 text-white">
                    <Icon name="ArrowLeft" size={16} strokeWidth={2}/>
                    <span className="">Take me back to home</span>
                </Link>
            </div>
        </section>
    )
}