import { createVedro } from 'vedro';
import type { LayerType, LayersState, LayerState } from '@/types/layers';
import { mockApi } from '@/services/mockApi';

const INITIAL_LAYERS: Record<LayerType, LayerState> = {
  temperature: {
    id: 'temperature',
    name: 'Температура',
    enabled: false,
    opacity: 1,
    status: 'idle',
  },
  wind: {
    id: 'wind',
    name: 'Ветер',
    enabled: false,
    opacity: 1,
    status: 'idle',
  },
  insolation: {
    id: 'insolation',
    name: 'Инсоляция',
    enabled: false,
    opacity: 1,
    status: 'idle',
  },
};

const initialState: LayersState = {
  layers: INITIAL_LAYERS,
};

// Map для хранения AbortController для каждого слоя
const activeRequests = new Map<LayerType, AbortController>();

const vedro = createVedro(initialState);
export const { Provider, useStore, useSelector } = vedro;

// Ссылка на store для использования вне React компонентов
let storeRef: ReturnType<typeof useStore> | null = null;

// Функция для сохранения ссылки на store (вызывается из компонента)
export const initStoreRef = (store: ReturnType<typeof useStore>) => {
  if (!storeRef) {
    storeRef = store;
  }
};

// Получение store вне React компонентов
const getStore = () => {
  if (!storeRef) {
    throw new Error('Store not initialized. Make sure Provider is mounted.');
  }
  return storeRef;
};

// Actions для работы со слоями
export const layersActions = {
  toggleLayer: async (layerId: LayerType) => {
    const store = getStore();
    const currentLayer = store.get().layers[layerId];
    const newEnabled = !currentLayer.enabled;

    if (newEnabled) {
      // Включаем слой и начинаем загрузку
      store.dispatch((state) => ({
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            enabled: true,
            status: 'loading' as const,
            error: undefined,
          },
        },
      }));

      // Отменяем предыдущий запрос если есть
      const existingRequest = activeRequests.get(layerId);
      if (existingRequest) {
        existingRequest.abort();
      }

      // Создаем новый AbortController
      const abortController = new AbortController();
      activeRequests.set(layerId, abortController);

      try {
        await mockApi.fetchLayerData(layerId, abortController.signal);

        // Проверяем что запрос не был отменен
        if (activeRequests.get(layerId) === abortController) {
          store.dispatch((state) => ({
            layers: {
              ...state.layers,
              [layerId]: {
                ...state.layers[layerId],
                status: 'success' as const,
              },
            },
          }));
          activeRequests.delete(layerId);
        }
      } catch (error) {
        // Проверяем что запрос не был отменен
        if (activeRequests.get(layerId) === abortController) {
          store.dispatch((state) => ({
            layers: {
              ...state.layers,
              [layerId]: {
                ...state.layers[layerId],
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Unknown error',
              },
            },
          }));
          activeRequests.delete(layerId);
        }
      }
    } else {
      // Выключаем слой и отменяем запрос
      const existingRequest = activeRequests.get(layerId);
      if (existingRequest) {
        existingRequest.abort();
      }
      activeRequests.delete(layerId);

      store.dispatch((state) => ({
        layers: {
          ...state.layers,
          [layerId]: {
            ...state.layers[layerId],
            enabled: false,
            status: 'idle' as const,
            error: undefined,
          },
        },
      }));
    }
  },

  setOpacity: (layerId: LayerType, opacity: number) => {
    const store = getStore();
    store.dispatch((state) => ({
      layers: {
        ...state.layers,
        [layerId]: {
          ...state.layers[layerId],
          opacity,
        },
      },
    }));
  },

  retryLayer: async (layerId: LayerType) => {
    const store = getStore();
    const currentLayer = store.get().layers[layerId];

    if (!currentLayer.enabled) {
      return;
    }

    store.dispatch((state) => ({
      layers: {
        ...state.layers,
        [layerId]: {
          ...state.layers[layerId],
          status: 'loading' as const,
          error: undefined,
        },
      },
    }));

    // Отменяем предыдущий запрос если есть
    const existingRequest = activeRequests.get(layerId);
    if (existingRequest) {
      existingRequest.abort();
    }

    const abortController = new AbortController();
    activeRequests.set(layerId, abortController);

    try {
      await mockApi.fetchLayerData(layerId, abortController.signal);

      if (activeRequests.get(layerId) === abortController) {
        store.dispatch((state) => ({
          layers: {
            ...state.layers,
            [layerId]: {
              ...state.layers[layerId],
              status: 'success' as const,
            },
          },
        }));
        activeRequests.delete(layerId);
      }
    } catch (error) {
      if (activeRequests.get(layerId) === abortController) {
        store.dispatch((state) => ({
          layers: {
            ...state.layers,
            [layerId]: {
              ...state.layers[layerId],
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          },
        }));
        activeRequests.delete(layerId);
      }
    }
  },
};
