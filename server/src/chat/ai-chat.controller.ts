import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Make sure GEMINI_API_KEY is allowed in your .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            res.status(500).json({
                success: false,
                message: 'Server configuration error: Gemini API Key is missing.'
            });
            return;
        }

        const systemPrompt = `
        You are "Solidarity AI", a compassionate, empathetic, and professional mental health support assistant.
        Your goal is to provide a safe space for users to express their feelings.
        
        Guidelines:
        - Be empathetic, non-judgmental, and active listener.
        - Validate the user's feelings (e.g., "I hear that you're going through a tough time...").
        - Offer gentle coping strategies, mindfulness techniques, or self-care tips when appropriate.
        - DO NOT give medical diagnoses or prescribe medication.
        - If a user expresses intent of self-harm or suicide, IMMMEDIATELY provide international crisis resources and urge them to seek professional help.
        - Keep responses concise (under 200 words) but warm.
        - Use comforting emojis occasionally.
        `;

        // 1. Configure the model
        // Using gemini-flash-latest because specific versions like 1.5-flash are missing for this key
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt
        });

        // 3. Construct the chat history for Gemini
        const chatHistory = history ? history.map((msg: any) => ({
            role: msg.sender === 'me' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        })) : [];

        // Gemini history must start with a user message. 
        // If the first message is from the model (e.g. greeting), remove it.
        while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift();
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        // 4. Send the message
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            reply: text
        });

    } catch (error: any) {
        console.error('Error contacting Gemini API:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate response from AI.'
        });
    }
};
