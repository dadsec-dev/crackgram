import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 300; // Set maximum duration to 300 seconds (5 minutes)
export const dynamic = 'force-dynamic'; // Make sure this is always a dynamic route

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Define the available models
const MODELS = {
  IDEOGRAM: "ideogram-ai/ideogram-v2-turbo",
  IMAGEN: "google/imagen-3"
};

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  try {
    const requestData = await request.json();
    const {
      prompt,
      negative_prompt = "",
      num_inference_steps = 50,
      guidance_scale = 7.5,
      width = 512,
      height = 512,
      scheduler = "DPMSolverMultistep",
      model = MODELS.IDEOGRAM, // Default model if not specified
    } = requestData;

    // Log the entire request for debugging
    console.log("Received request with data:", {
      prompt: prompt?.substring(0, 30) + "...",
      model,
      width,
      height,
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "A prompt is required to generate an image" },
        { status: 400 }
      );
    }

    // Validate dimensions
    const validDimensions = [512, 768, 1024];
    const validWidth = validDimensions.includes(width) ? width : 512;
    const validHeight = validDimensions.includes(height) ? height : 512;

    // Determine the image dimensions format
    const image_dimensions = `${validWidth}x${validHeight}`;

    // Validate scheduler
    const validSchedulers = ["DPMSolverMultistep", "DDIM", "K_EULER", "K_EULER_ANCESTRAL", "PNDM"];
    const validScheduler = validSchedulers.includes(scheduler) ? scheduler : "DPMSolverMultistep";

    console.log(`Generating image with prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);
    console.log(`Parameters: ${image_dimensions}, steps: ${num_inference_steps}, guidance: ${guidance_scale}, scheduler: ${validScheduler}`);
    console.log(`Using model: ${model}`);

    // Configure model and input params based on selected model
    let modelId;
    let inputParams = {};

    // Explicitly check for Imagen model
    if (model === MODELS.IMAGEN) {
      console.log(`Selected Google Imagen model: ${MODELS.IMAGEN}`);
      modelId = MODELS.IMAGEN;
      inputParams = {
        prompt: prompt,
        negative_prompt: negative_prompt,
        width: validWidth,
        height: validHeight,
        num_inference_steps: num_inference_steps,
        guidance_scale: guidance_scale,
      };
    } else {
      // Default to Ideogram model
      console.log(`Selected Ideogram model: ${MODELS.IDEOGRAM}`);
      modelId = MODELS.IDEOGRAM;
      inputParams = {
        prompt: prompt,
        negative_prompt: negative_prompt,
        image_dimensions: image_dimensions,
        num_outputs: 1,
        num_inference_steps: num_inference_steps,
        guidance_scale: guidance_scale,
        scheduler: validScheduler,
      };
    }

    console.log(`Final model selection: ${modelId}`);
    console.log(`Input parameters:`, JSON.stringify(inputParams));

    // Cast modelId to the required type for replicate.run
    const replicateModelId = modelId as `${string}/${string}` | `${string}/${string}:${string}`;

    const output = await replicate.run(
      replicateModelId,
      {
        input: inputParams,
      }
    );

    // Return the model ID along with the output for verification
    return NextResponse.json({ 
      output,
      modelUsed: modelId 
    }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during image generation" },
      { status: 500 }
    );
  }
}
