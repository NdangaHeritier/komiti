//  A reusable Input component so that i don't need to rewrite new styles and classes for any form i created.
// just add an Input component and pass the properties and let it handle the styles.
// just in case i see the border is too flashy i can come here and suggest one change an become applied in all files i used it
// without headeche to use it so many times


// A type difine what kind of properties(props) to be accepted in my component.

type InputTypes = {
    name: string,
    type: string,
    value: string | number,
    id?: string,
    placeholder?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

}

// then assign the type in received props for check and catch errors early in editor.
export const Input = ({name, type,value, id, placeholder, onChange}:InputTypes) => {
    return (
        <input
            name={name}
            id={id}
            value={value}
            type={type}
            onChange={onChange}
            placeholder={placeholder ||  `Type ${name} here!`}
            className="text-gray-700 px-5 py-3 border outline-0 border-gray-300 rounded-lg focus:bg-gray-200 focus:border-gray-100 focus:ring-2 focus:ring-gray-300 transition-all duration-300 w-full"
        />
    )
}