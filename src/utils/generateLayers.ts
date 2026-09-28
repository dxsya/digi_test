import type { LayerState } from '@/types/layers';

// Генератор слоёв для демонстрации масштабируемости
export const generateLayers = (count: number): Record<string, LayerState> => {
  const layers: Record<string, LayerState> = {};

  const categories = ['temperature', 'wind', 'insolation', 'pressure', 'humidity', 'precipitation'];
  const regions = ['north', 'south', 'east', 'west', 'central'];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const region = regions[Math.floor(i / categories.length) % regions.length];
    const index = Math.floor(i / (categories.length * regions.length));

    const id = `${category}_${region}${index > 0 ? `_${index}` : ''}`;

    layers[id] = {
      id: id as any,
      name: `${category} (${region})${index > 0 ? ` #${index}` : ''}`,
      enabled: false,
      opacity: 1,
      status: 'idle',
    };
  }

  return layers;
};

// Метрики производительности
export const measureRenderTime = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
};
