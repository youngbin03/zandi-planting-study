export function initializeButtons() {
    const toggleSubInfoButton = document.getElementById("toggleSubInfoButton");
    toggleSubInfoButton.style.display = "initial";
    toggleSubInfoButton.addEventListener("click", toggleSubInfo)
}

function toggleSubInfo() {
    const subInfoElements = document.getElementsByClassName("sub-info");
    for (const subInfoElement of Array.from(subInfoElements).map(e => e as HTMLElement)) {
        subInfoElement.classList.toggle("reveal")
    }
}