type LabelProps = React.ComponentProps<"label">

export function Label(props: LabelProps) {
    return <label {...props} className="px-2 py-1"/>
}
