import { Link } from "react-router-dom"

// Here think of need to add a link on header like a button for quick action like | login| signup | Get Started.
// also you'll need to use the same styled button over the comoneent in add links for | explore| buy | contribute| and so on
// this is defer to FormButton because this is used a s a single style link component to se wherever you need a link like button.

type LinkProps = {
    href?: string,
    variant?: "primary" | "secondary" | "green" | "blue",
    text: string,
    size?: "sm" | "md" | "lg"
}

export const ButtonLink = ({href="/", text, variant= "primary", size="lg"}:LinkProps) => {
    const colors = {
        primary: "bg-gray-900 text-gray-100 hover:bg-gray-950 focus:ring-gray-700 rounded-md",
        secondary: "bg-transparent text-gray-700 hover:bg-gray-500/10 focus:ring-gray-400 rounded-md border border-gray-300",
        green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 rounded-md",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 rounded-md"
    }
    const sizes = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-2"
    }
    return(
        <Link to={href} className={`${colors[variant]} font-semibold duration-400 ${sizes[size]} flex items-center justify-center gap-2 focus:ring-2 text-sm`}
        >
            {text}
        </Link>
    )
}