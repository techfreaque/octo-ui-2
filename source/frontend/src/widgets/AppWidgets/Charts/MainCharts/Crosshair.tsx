function handleCrossHair(event: MouseEvent) {
  const hairH = document.getElementById("crosshair-h");
  const hairV = document.getElementById("crosshair-v");
  if (hairH && hairV) {
    hairH.style.top = `${event.pageY}px`;
    hairV.style.left = `${event.pageX}px`;
  }
}
export function handleCrosshairOnMouseEnter() {
  document.addEventListener("mousemove", handleCrossHair);
  const hairH = document.getElementById("crosshair-h");
  const hairV = document.getElementById("crosshair-v");
  if (hairH && hairV) {
    hairH.style.display = "block";
    hairV.style.display = "block";
  }
}
export function handleCrosshairOnMouseLeave() {
  document.removeEventListener("mousemove", handleCrossHair);
  const hairH = document.getElementById("crosshair-h");
  const hairV = document.getElementById("crosshair-v");
  if (hairH && hairV) {
    hairH.style.display = "none";
    hairV.style.display = "none";
  }
}

export default function Crosshair() {
  return (
    <>
      <div id="crosshair-h" className="hair" />
      <div id="crosshair-v" className="hair" />
    </>
  );
}
