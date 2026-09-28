import type { LayerType } from '@/types/layers';

interface MockLayerData {
  id: LayerType;
  data: string;
  timestamp: number;
}

const LOADING_DELAY = 1500;
const ERROR_PROBABILITY = 0.2;

export class MockApiService {
  private requestCount = 0;

  async fetchLayerData(
    layerId: LayerType,
    signal?: AbortSignal
  ): Promise<MockLayerData> {
    this.requestCount++;
    const requestId = this.requestCount;

    console.log(`[API] Request #${requestId}: Fetching ${layerId}`);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (signal?.aborted) {
          console.log(`[API] Request #${requestId}: Aborted ${layerId}`);
          reject(new Error('Request aborted'));
          return;
        }

        const shouldFail = Math.random() < ERROR_PROBABILITY;

        if (shouldFail) {
          console.log(`[API] Request #${requestId}: Failed ${layerId}`);
          reject(new Error(`Failed to load ${layerId} layer`));
        } else {
          console.log(`[API] Request #${requestId}: Success ${layerId}`);
          resolve({
            id: layerId,
            data: `Mock data for ${layerId}`,
            timestamp: Date.now(),
          });
        }
      }, LOADING_DELAY);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          console.log(`[API] Request #${requestId}: Aborted ${layerId}`);
          reject(new Error('Request aborted'));
        });
      }
    });
  }
}

export const mockApi = new MockApiService();
