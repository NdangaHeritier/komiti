import { Link } from "react-router-dom"

// Here think of need to add a link on header like a button for quick action like | login| signup | Get Started.
// also you'll need to use the same styled button over the comoneent in add links for | explore| buy | contribute| and so on
// this is defer to FormButton because this is used a s a single style link component to se wherever you need a link like button.

type LinkProps = {
    href?: string,
    variant?: "primary" | "secondary" | "green" | "blue",
    text: string
}

export const ButtonLink = ({href="/", text, variant= "primary"}:LinkProps) => {
    const colors = {
        primary: "bg-gray-900 text-gray-100 hover:bg-gray-950 focus:ring-gray-700 rounded-md",
        secondary: "bg-transparent text-blue-600 hover:bg-blue-200 focus:ring-blue-400 rounded-full",
        green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 rounded-md",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 rounded-md"
    }
    return(
        <Link to={href} className={`${colors[variant]} font-semibold duration-400 text-base px-5 py-3 flex items-center justify-center gap-2 focus:ring-2`}
        >
            {text}
        </Link>
    )
}