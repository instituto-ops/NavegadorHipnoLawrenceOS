import { pipeline } from '@xenova/transformers';
import type { PipelineType } from '@xenova/transformers';

// Define the signature we expect from the feature-extraction pipeline
type FeatureExtractionPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<{ data: Float32Array }>;

// Singleton instance to prevent multiple model loads
class PipelineSingleton {
  static task: PipelineType = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: FeatureExtractionPipeline | null = null;

  static async getInstance(
    progress_callback?: (progress: unknown) => void
  ): Promise<FeatureExtractionPipeline> {
    if (this.instance === null) {
      // The @xenova/transformers types are generic, so we cast to our expected signature
      this.instance = (await pipeline(this.task, this.model, {
        progress_callback,
      })) as unknown as FeatureExtractionPipeline;
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event: MessageEvent) => {
  try {
    const { id, type, payload } = event.data;

    // Load the pipeline
    const extractor = await PipelineSingleton.getInstance((x: unknown) => {
      // Post progress updates to the main thread
      self.postMessage({ id, status: 'progress', progress: x });
    });

    if (type === 'embed') {
      const { text } = payload;
      // Generate embeddings
      const output = await extractor(text, { pooling: 'mean', normalize: true });

      // Send the output back
      self.postMessage({
        id,
        status: 'complete',
        result: Array.from(output.data),
      });
    } else {
      self.postMessage({ id, status: 'error', error: `Unknown task type: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      id: event.data?.id,
      status: 'error',
      error: (error as Error).message || 'An error occurred during inference',
    });
  }
});
