
import { pipeline } from "@huggingface/transformers";

export interface LocalGenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  numSteps?: number;
  width?: number;
  height?: number;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed?: number;
  cost?: number;
}

export class LocalGpuService {
  private pipeline: any = null;

  async initialize() {
    try {
      // Using "image-to-image" pipeline which is supported
      this.pipeline = await pipeline(
        "image-to-image",
        "stabilityai/stable-diffusion-2-1-base",
        { device: "webgpu" }
      );
      return true;
    } catch (error) {
      console.error("Failed to initialize WebGPU pipeline:", error);
      return false;
    }
  }

  async generateImage(params: LocalGenerateImageParams) {
    if (!this.pipeline) {
      throw new Error("Pipeline not initialized. Call initialize() first.");
    }

    try {
      const result = await this.pipeline(params.prompt, {
        negative_prompt: params.negativePrompt,
        num_inference_steps: params.numSteps || 20,
        seed: params.seed,
        width: params.width || 512,
        height: params.height || 512,
      });

      return result;
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  }
}
