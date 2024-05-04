export function createUserBoxLoader() : HTMLElement{
    const mockUserBox = document.createElement("div")
    mockUserBox.className = "user-info"

    const spinner = document.createElement("div")
    spinner.classList.add("loader")

    mockUserBox.appendChild(spinner)
    return mockUserBox;
}