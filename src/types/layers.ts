export type LayerType = 'temperature' | 'wind' | 'insolation';

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LayerState {
  id: LayerType;
  name: string;
  enabled: boolean;
  opacity: number;
  status: LoadingStatus;
  error?: string;
}

export interface LayersState {
  layers: Record<LayerType, LayerState>;
}
