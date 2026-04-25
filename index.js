const textAreaInput = document.getElementById("lang-input")
const textAreaOutput = document.getElementById("lang-output")
const textAreaOriginalText = document.getElementById("original-text")

const btnTranslate = document.getElementById("btn-translate")
const btnStartOver = document.getElementById("btn-start-over")

async function handleClick() {
    const language = document.querySelector('input[name="languages"]:checked').value;
    const textInput = textAreaInput.value

   await sendServerRequest(language, textInput)
}

btnTranslate.addEventListener("click", handleClick)
btnStartOver.addEventListener("click", () => {
    document.getElementById("translate-section").style.display = "block"
    document.getElementById("output-section").style.display = "none"
    textAreaInput.value = ""
    textAreaOutput.value = ""
    textAreaOriginalText.value = ""
})

async function sendServerRequest(language, inputText) {
    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, text: inputText })
        })

        if (!response.ok) {
            throw new Error('Failed to translate text.')
        }

        const { translation } = await response.json()
        hideInputShowOutput()
        renderUI(translation)
    } catch (error) {
        console.error(error)
        
        textAreaOutput.value = 'Unable to translate right now.'
    }
}

function hideInputShowOutput() {
    document.getElementById("translate-section").style.display = "none"
    document.getElementById("output-section").style.display = "block"
}

function renderUI(response) {
    console.log(response)

    textAreaOriginalText.value = textAreaInput.value
    textAreaOutput.value = response
}