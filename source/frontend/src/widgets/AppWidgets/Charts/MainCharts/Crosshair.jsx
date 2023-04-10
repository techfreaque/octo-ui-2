function handleCrossHair(event) {
    const hairH = document.getElementById('crosshair-h')
    hairH.style.top = `${
        event.pageY
    }px`;
    const hairV = document.getElementById('crosshair-v')
    hairV.style.left = `${
        event.pageX
    }px`;
}
export function handleCrosshairOnMouseEnter() {
    document.addEventListener("mousemove", handleCrossHair)
    const hairH = document.getElementById('crosshair-h')
    hairH.style.display = 'block'
    const hairV = document.getElementById('crosshair-v')
    hairV.style.display = 'block'
}
export function handleCrosshairOnMouseLeave() {
    document.removeEventListener("mousemove", handleCrossHair)
    const hairH = document.getElementById('crosshair-h')
    hairH.style.display = 'none'
    const hairV = document.getElementById('crosshair-v')
    hairV.style.display = 'none'
}

export default function Crosshair() {

    return (<>
        <div id="crosshair-h" className="hair"></div>
        <div id="crosshair-v" className="hair"></div>
    </>)
}
