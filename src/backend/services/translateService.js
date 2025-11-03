import fetch from "node-fetch";

export const translateText = async (text, from, to) => {
    const AZURE_KEY = process.env.AZURE_TRANSLATE_KEY;
    const LOCATION = process.env.AZURE_TRANSLATE_LOCATION || "westus2";
    const ENDPOINT = "https://api.cognitive.microsofttranslator.com/";

    const res = await fetch(
        `${ENDPOINT}/translate?api-version=3.0&from=${from}&to=${to}`,
        {
            method: "POST", 
            headers: {
                "Ocp-Apim-Subscription-Key": AZURE_KEY,
                "Ocp-Apim-Subscription-Region": LOCATION,
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{ text }]),
        }
    );

    const data = await res.json();
    return data;
};

