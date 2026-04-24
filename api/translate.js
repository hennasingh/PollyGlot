import 'dotenv/config'
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

    // Handle preflight CORS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

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
}
