const colorInput = document.getElementById("color")
const modeInput = document.getElementById("mode")
const scheme = document.getElementById("scheme")

document.getElementById("generate-btn").addEventListener("click", generateColorScheme)
document.addEventListener("keyup", e => {
    if(e.code === 'Space') {
        setRandomColor()
        generateColorScheme()
    }
})
document.addEventListener("click", e => {
    if(e.target.id === "random-scheme") {
        setRandomColor()
        generateColorScheme()
    }

    if(e.target.classList[0] === "hex") {
        const hexElementContent = e.target.parentElement.textContent
        const hexCode = hexElementContent.substring( hexElementContent.indexOf("#") )
        navigator.clipboard.writeText(hexCode)
        alert("Color copied to your clipbord!")
    }
})

function setRandomColor() {
    const getRandomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`
    colorInput.value = getRandomHex()
}

function generateColorScheme() {
    const color = colorInput.value.slice(1) // delete the # from the hex value
    const mode = modeInput.value
    
    fetch(`https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}`)
        .then(response => response.json())
        .then(data => renderNewScheme(data.colors))
}

function renderNewScheme(colors) {
    schemeHtml = ""
    colors.forEach((color, index) => {
        schemeHtml +=`
        <div class="color-scheme" id="color${index}" style="background: ${color.hex.value}"></div>
        <p id="hex${index}"> ${color.name.value} <br> <span class="hex">${color.hex.value}</span> </p>
        `
    })
    scheme.innerHTML = schemeHtml
}

function renderColorModes() {
    const capitalize = s => s[0].toUpperCase() + s.slice(1)

    const modes = getAvailableColorModes()
    let modesHtml = ""
    modes.forEach( mode => {
        modesHtml += `<option value="${mode}">${capitalize(mode)}</option>`
    })
    modeInput.innerHTML = modesHtml
}

function getAvailableColorModes() {
    // The api doesn't provide a way to get the modes, so I hard code them ... 
    return ["monochrome", "monochrome-dark", "monochrome-light", "analogic",
            "complement", "analogic-complement", "triad", "quad"]
}

renderColorModes()
setRandomColor()
generateColorScheme()