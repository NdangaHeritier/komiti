// A form button component reusable everywhere in my app to add a button
// why added? to help you make one button styles that you can edit and change in one place for all over the app.
// how to use. you just pass the button type and onClick if available for CTAs buttons and for form button you pass a submit type.


// Declared a type of data allowed to be passed as a props to my button. to avoid error at time..
type ButtonProps = {
   type: "submit" | "reset" | "button" | undefined, //my button should receive one of this type as allowed or undefined value..
    variant?: "primary" | "secondary" | "green" | "blue", // a color variant for user to choose what button color he like to use..
    onClick?: () => void, // onClick handler for CTAs and other reusable button like a button which will open a contribution modal..
    text: string // a button main text to display must be a string as well.
}

export const FormButton = (
    {type="button", text, variant= "primary", onClick}:ButtonProps // Assign the type of props you want to receive to the props you'll receive so it checks whether they match as decalred.
) => {

    // declare the color variants classes for user to choose adn then apply related variant classes to button className..
    const colors = {
        primary: "bg-gray-900 text-gray-100 hover:bg-gray-950 focus:ring-gray-700 rounded-md",
        secondary: "bg-transparent text-blue-600 hover:bg-blue-200 focus:ring-blue-400 rounded-full",
        green: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 rounded-md",
        blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 rounded-md"
    }
    return(
        // Pass all the props to the button so it changes when props changes too.
        // example a user declared <FormButton type="button" variant="blue" onClick={() => console.log("button clicked!")} />
        // in another component. the FormButton will apply the variant classes for blue color and type as requested then return this button in-place.
        <button
            type={type}
            className={`${colors[variant]} font-semibold duration-400 text-base px-5 py-3 flex items-center justify-center gap-2 focus:ring-2`}
            onClick={onClick}
        >
            {text}
        </button>
    )
}