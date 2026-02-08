type InputProps = React.ComponentProps<"input">

export function Input(props: InputProps) {
    return <input {...props} className="border rounded-md px-2 py-1"/>
}