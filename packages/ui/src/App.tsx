import { useEffect, useRef, useState } from "react"
import { Label } from "./components/Label"
import { Input } from "./components/Input"
import { Button } from "./components/Button"
import { getScan, queueScan } from "./api/scans"

function App() {
    const [path, setPath] = useState<string>("")
    const [scanId, setScanId] = useState<string>("")
    const [scanStatus, setScanStatus] = useState<string>("")
    const retryRef = useRef<undefined | number>(undefined)

    useEffect(() => {
        if (scanId !== "" && !(scanStatus === "completed" || scanStatus === "error")) {
            retryRef.current = setInterval(async () => {
                console.log("Interval!")
                const scan = await getScan(scanId)
                setScanStatus(scan.status)
            }, 1000)
        } else {
            clearInterval(retryRef.current)
            console.log("Interval cleared")
        }
    })

    const handleScanOnClick: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        const scan = await queueScan(path)
        setScanId(scan.id)
        setScanStatus(scan.status)
    }

    const handlePathOnChange: React.ChangeEventHandler<HTMLInputElement> = (
        event
    ) => {
        setPath(event.target.value)
    }
    return (
        <>
            <Label>Path</Label>
            <Input value={path} onChange={handlePathOnChange} />
            <Button onClick={handleScanOnClick}>Scan</Button>
            <p>Scan: {scanId}</p>
            <p>Status: {scanStatus}</p>
        </>
    )
}

export default App
