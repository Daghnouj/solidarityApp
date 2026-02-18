import dotenv from 'dotenv';
dotenv.config();

// Polyfill fetch for Node environments if needed (Node 18+ has it native)
// If running in an environment without fetch, we might need 'node-fetch' but let's assume Node 18+
// considering the user has a recent project.

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Checking key...", key ? "Present" : "Missing");

    if (!key) {
        console.error("No API key found in .env");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log("Fetching models from:", url.replace(key, "HIDDEN_KEY"));

    try {
        const response = await fetch(url);
        const data: any = await response.json();


        if (data.error) {
            console.error("❌ API ERROR:");
            console.error(JSON.stringify(data.error, null, 2));
        } else {
            console.log("✅ API SUCCESS. Available Models:");
            if (data.models) {
                data.models.forEach((m: any) => {
                    console.log(`- ${m.name}`);
                    console.log(`  Supported methods: ${m.supportedGenerationMethods}`);
                });
            } else {
                console.log("No models returned (empty list).");
            }
        }
    } catch (e: any) {
        console.error("❌ NETWORK/FETCH ERROR:", e.message);
    }
}

listModels();
