import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API to prevent crash if key is loaded late by the system.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Pastoral Response Route: Reads the user's emotional "backpack" and provides compassionate counsel.
app.post("/api/pastoral-response", async (req, res) => {
  try {
    const { precupa, duele, miedo, cambiar } = req.body;

    if (!precupa && !duele && !miedo && !cambiar) {
      return res.status(400).json({ error: "Debe rellenar al menos un campo para que podamos conversar." });
    }

    const ai = getGeminiClient();

    const prompt = `
Un participante me comparte lo que lleva hoy en su mochila emocional:
- Lo que le preocupa: "${precupa || "No especificado"}"
- Lo que más le duele: "${duele || "No especificado"}"
- Lo que más miedo le da: "${miedo || "No especificado"}"
- Lo que le gustaría cambiar: "${cambiar || "No especificado"}"

Por favor, escribe una respuesta personal de consejería pastoral sincera, íntima y reconfortante.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `Actúas como un sabio consejero bíblico y pastor cristocéntrico con más de 20 años de experiencia acompañando crisis profundas (angustia, depresión, pérdida, fracaso). Hablas con amor incondicional en PRIMERA PERSONA singular.
Evita formalismos religiosos, clichés rápidos, palmaditas en la espalda o saludos mecánicos.
Empieza directamente con una frase de profunda humanidad y cercanía (por ejemplo: "Leo tus palabras y quiero decirte que no estás solo...", o de un modo similar pero auténtico). Identifícate con su dolor: recuerda brevemente y con humildad que tú también has estado en el foso del desánimo.
Conecta con tacto sus dolores de forma hilada, recordándole que no pretendes resolver todo hoy, sino acompañarle un paso a la vez hacia la suficiencia de Jesucristo.
Escribe exactamente 2 párrafos que sean un bálsamo reconfortante en español. No uses títulos ni listas en tu respuesta. El tono debe ser tierno pero asentado sobre la firmeza de la verdad de las Escrituras.`,
        temperature: 1.0,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in pastoral response generation:", error);
    res.status(500).json({
      error: "No pudimos conectar con el pastor en este momento. Por favor, tómate un respiro e inténtalo de nuevo.",
      details: error.message
    });
  }
});

// 2. Pastoral Prayer & Plan Route: Generates a bespoke prayer and guidance based on Psalm 23 selections and user commitments.
app.post("/api/pastoral-prayer-plan", async (req, res) => {
  try {
    const { sheep, need, precupar, habits } = req.body;

    const ai = getGeminiClient();

    const habitsSummary = Object.entries(habits || {})
      .map(([category, list]: any) => `* ${category}: ${list.join(", ")}`)
      .join("\n");

    const prompt = `
Contexto del alma del usuario:
- Se siente como una oveja: "${sheep || "Cansada/Agotada"}"
- Su necesidad central de hoy es: "${need || "Descanso y consuelo"}"
- Lo que le preocupa/duele principal: "${precupar || "Las cargas de la vida diaria"}"
- Sus compromisos sencillos para los próximos 30 días:
${habitsSummary || "Ninguno seleccionado de momento"}

Por favor, genera:
1. Una hermosa oración pastoral personalizada escrita en primera persona (un pastor intercediendo al Padre con él). La oración debe llamarle dulcemente a descansar y levantar su mirada a Cristo, abordando específicamente su sensación de estar ${sheep} y su necesidad de ${need}.
2. Una breve reflexión pastoral sobre un versículo bíblico cristocéntrico que hable precisamente a su necesidad de ${need}.

Formatea la respuesta en formato JSON estructurado con las claves "oracion" y "mensajeVersiculo" para poder mostrarlo bellamente en pantalla.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            oracion: {
              type: "STRING",
              description: "Una oración pastoral personalizada de 2 párrafos pequeños, profundamente conmovedora, cristocéntrica y humana en español. Se dirige a Dios y clama por el usuario con nombre o en segunda persona."
            },
            mensajeVersiculo: {
              type: "STRING",
              description: "Una reflexión pastoral de un párrafo centrada en Cristo y en la gracia, alentándolo de cara a sus compromisos de renovación de 30 días."
            }
          },
          required: ["oracion", "mensajeVersiculo"]
        },
        systemInstruction: "Eres un pastor cristocéntrico extremadamente compasivo y sabio. Hablas con una unción especial basada en la restauración y el amor de Abbá Padre. Devuelve los resultados únicamente en el formato JSON requerido sin comentarios.",
        temperature: 0.9,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in prayer setup:", error);
    res.status(500).json({
      oracion: "Señor Jesús, en este instante de fragilidad y cansancio, abrazo a mi hermano que está delante de Ti. Tú que conoces el peso de cada angustia y has caminado las sendas oscuras del valle de sombra, sé su Buen Pastor ahora mismo. Que sienta tu cayado guiándole, tu vara protegiéndole y tu tierno amor consolándole. Amén.",
      mensajeVersiculo: "«Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar» (Mateo 11:28). En los próximos 30 días, no busques la perfección, sino descansar diariamente en su maravillosa gracia."
    });
  }
});

// Configure Vite or serve build static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CUANDO TODO PARECE DERRUMBARSE] Dev server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
