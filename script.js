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

const languages = ["python", "java", "c++"]; // Supported target languages
const vulnerabilities = [
    "sql injection",
    "xss", // Cross-Site Scripting
    "directory traversal",
    // Add more vulnerabilities as needed...
];

function promptUser() {
    userInterface.question("Enter the code to translate: ", async (input) => {
        try {
            const targetLanguage = await selectTargetLanguage();
            const translatedCode = await translateCode(input, targetLanguage);

            console.log("\nTranslated Code:");
            console.log(translatedCode);

            const foundVulnerabilities = checkForVulnerabilities(translatedCode);
            if (foundVulnerabilities.length > 0) {
                console.log("\nDetected vulnerabilities:");
                foundVulnerabilities.forEach((vulnerability) => {
                    console.log(vulnerability);
                });
            } else {
                console.log("\nNo vulnerabilities detected.");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        promptUser();
    });
}

function selectTargetLanguage() {
    return new Promise((resolve, reject) => {
        userInterface.question(
            `Select target language (${languages.join(', ')}): `,
            (selectedLanguage) => {
                const language = selectedLanguage.toLowerCase();
                if (languages.includes(language)) {
                    resolve(language);
                } else {
                    reject(`Unsupported language: ${selectedLanguage}`);
                }
            }
        );
    });
}

async function translateCode(inputCode, targetLanguage) {
    const chatCompletion = await openai.chat.completions.create({
        model: "text-davinci-002",
        messages: [
            { role: "user", content: inputCode },
            { role: "assistant", content: `Translate this code to ${targetLanguage}` },
        ],
    });

    return chatCompletion.choices[0].message.content;
}

function checkForVulnerabilities(code) {
    const foundVulnerabilities = [];
    vulnerabilities.forEach((vulnerability) => {
        if (code.toLowerCase().includes(vulnerability)) {
            foundVulnerabilities.push(vulnerability);
        }
    });
    return foundVulnerabilities;
}

console.log("Welcome to Code Translator and Vulnerability Checker");
console.log("You can translate code between Python, Java, and C++.");
console.log("Type 'exit' to quit.");

promptUser();
