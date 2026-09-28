import { useSelector } from '@/store/layersStore';
import type { LayerType, LayersState } from '@/types/layers';

export const useLayer = (layerId: LayerType) => {
  return useSelector((state: LayersState) => state.layers[layerId]);
};
