import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCDx4Gz3ACIg5DSXxaoYFZAOJfm6G9r4lw");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are the Pizza Sensei. Speak in very short, simple sentences. Use pizza puns. Explain that paying debt increases credit scores. Max 12 words."
});

export async function getInnerVoiceAdvice(action, state) {
    // We add a random number to the prompt so Gemini CANNOT give the same answer twice
    const prompt = `Action: ${action}. Wallet: ${state.walletCoins}, Debt: ${state.creditDebt}. Random ID: ${Math.random()}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        return "You're doing great, chef! Keep that dough rising!";
    }
}