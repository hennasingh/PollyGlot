import 'dotenv/config'
import OpenAI from 'openai'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

app.post('/api/translate', async (req, res) => {
    try {
        const { language, text } = req.body

        if (!language || !text) {
            return res.status(400).json({ error: 'language and text are required' })
        }

        const messages = [
            {
                role: 'developer',
                content: "You are a language guru in French, Japanese and Spanish. Given user's input in english, translate the text in given choice and return a single sentence translation."
            },
            {
                role: 'user',
                content: `${text} in ${language}`
            }
        ]

        const response = await client.responses.create({
            model: 'gpt-5-nano',
            input: messages
        })

        console.log(response)
        const translation = response?.output_text ?? ''

        return res.json({ translation })
    } catch (error) {
        console.error('Translation error:', error)
        return res.status(500).json({ error: 'Unable to translate at this time.' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`)
})