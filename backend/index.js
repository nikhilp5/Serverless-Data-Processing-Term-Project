const express = require("express")
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai")

const app = express()

app.use(express.json())

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration)

// Feature - Team Management

// End point to generate team name
app.post("/generate-team-name", async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Generate two random team name`,
            max_tokens: 100,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"]
        })
        return res.status(200).json({
            success: true,
            data: response.data.choices[0].text
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response ? error.response.data : "Issue on the server"
        })
    }
})

// End point for list of team mambers

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))