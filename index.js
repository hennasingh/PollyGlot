const textAreaInput = document.getElementById("lang-input")
const textAreaOutput = document.getElementById("lang-output")

const btnTranslate = document.getElementById("btn-translate")

async function handleClick() {
    const language = document.querySelector('input[name="languages"]:checked').value;
    const textInput = textAreaInput.value

   await sendServerRequest(language, textInput)
}

btnTranslate.addEventListener("click", handleClick)

async function sendServerRequest(language, inputText) {
    try {
        const response = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, text: inputText })
        })

        if (!response.ok) {
            throw new Error('Failed to translate text.')
        }

        const data = await response.json()
        renderUI(data)
    } catch (error) {
        console.error(error)
        textAreaOutput.value = 'Unable to translate right now.'
    }
}

function renderUI(response) {
    console.log(response)
    textAreaOutput.value = response.translation ?? ''
}