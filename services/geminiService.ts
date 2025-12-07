import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";

export const generateHeadshot = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash-image for image editing tasks
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Edit this image. ${prompt} Ensure the face remains recognizable but improve the overall quality to professional standards. Output the result as an image.`,
          },
        ],
      },
      // Note: responseMimeType is NOT supported for nano banana (gemini-2.5-flash-image)
    });

    // Extract the image from the response parts
    // The response might contain text and image parts. We need to find the image.
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate headshot.");
  }
};
