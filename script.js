import { config } from "dotenv";
import OpenAI from 'openai';
import readline from "readline";

config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

userInterface.prompt();

userInterface.on("line", async (input) => {
    try {
        const translatedCode = await translateCode(input);
        console.log("Translated Code:");
        console.log(translatedCode);
    } catch (error) {
        console.error("Error:", error);
    }

    userInterface.prompt();
});

async function translateCode(inputCode) {
    // Define the target language you want to translate to (e.g., Java).
    const targetLanguage = "java";

    // Create a chat conversation with user input and target language.
    const chatCompletion = await openai.chat.completions.create({
        model: "text-davinci-002", // You can adjust the model as needed.
        messages: [
            { role: "user", content: inputCode },
            { role: "assistant", content: `Translate this code to ${targetLanguage}` },
        ],
    });

    // Extract and return the translated code.
    const translatedCode = chatCompletion.choices[0].message.content;
    return translatedCode;
}