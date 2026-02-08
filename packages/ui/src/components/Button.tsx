type ButtonProps = React.ComponentProps<"button">

export function Button(props: ButtonProps) {
    return <button {...props} className="border rounded-md py-1 px-2" />
}