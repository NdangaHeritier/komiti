//  A reusable TextArea component so that i don't need to rewrite new styles and classes for any form i created.
// just add an textArea component and pass the properties and let it handle the styles.
// just in case i see the border is too flashy i can come here and suggest one change an become applied in all files i used it
// without headeche to use it so many times

// declare it's type also..
type FieldTypes = {
    name: string,
    value: string | number,
    placeholder?: string,
    id?: string,
    cols?: number,
    rows?: number,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void

}

export const TextArea = ({ // assign the type to all props at time..
    name,
    id,
    value,
    placeholder,
    cols=10,
    rows=14,
    onChange,
}:FieldTypes) => {
    return (
        <textarea
            name={name}
            id={id}
            value={value}
            className="text-gray-700 px-4 py-2 border outline-0 border-gray-300 rounded-lg focus:bg-gray-200 focus:border-gray-100 focus:ring-2 focus:ring-gray-300 transition-all duration-300 w-full"
            placeholder={placeholder || `Type ${name} Here!`}
            cols={cols}
            rows={rows}
            onChange={onChange}
        >

        </textarea>
    )
}