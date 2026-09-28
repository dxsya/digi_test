import { memo } from 'react';
import styled from 'styled-components';
import { useSelector } from '@/store/layersStore';
import type { LayersState, LayerType } from '@/types/layers';

const LAYER_COLORS: Record<LayerType, string> = {
  temperature: '#ff4444',
  wind: '#4444ff',
  insolation: '#ffaa00',
};

const LAYER_NAMES: Record<LayerType, string> = {
  temperature: 'Температура',
  wind: 'Ветер',
  insolation: 'Инсоляция',
};

const LayerTile = ({ layerId }: { layerId: LayerType }) => {
  const layer = useSelector((state: LayersState) => state.layers[layerId]);

  return (
    <Tile
      $enabled={layer.enabled}
      $color={LAYER_COLORS[layerId]}
      $opacity={layer.opacity}
    >
      <TileHeader>
        <TileName>{LAYER_NAMES[layerId]}</TileName>
        <StatusBadge $status={layer.status}>{layer.status}</StatusBadge>
      </TileHeader>

      <TileContent>
        {!layer.enabled && (
          <DisabledOverlay>
            <DisabledIcon>🔒</DisabledIcon>
            <DisabledText>Слой отключен</DisabledText>
          </DisabledOverlay>
        )}

        {layer.enabled && layer.status === 'loading' && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>Загрузка данных...</LoadingText>
          </LoadingOverlay>
        )}

        {layer.enabled && layer.status === 'success' && (
          <SuccessContent>
            <DataVisualization $color={LAYER_COLORS[layerId]} $opacity={layer.opacity}>
              <DataPattern />
              <DataInfo>
                <DataIcon>
                  {layerId === 'temperature' && '🌡️'}
                  {layerId === 'wind' && '💨'}
                  {layerId === 'insolation' && '☀️'}
                </DataIcon>
                <OpacityInfo>Прозрачность: {Math.round(layer.opacity * 100)}%</OpacityInfo>
              </DataInfo>
            </DataVisualization>
          </SuccessContent>
        )}

        {layer.enabled && layer.status === 'error' && (
          <ErrorOverlay>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorText>{layer.error || 'Ошибка загрузки'}</ErrorText>
            <ErrorHint>Используйте кнопку "Повторить загрузку"</ErrorHint>
          </ErrorOverlay>
        )}
      </TileContent>
    </Tile>
  );
};

const MapVisualization = () => {
  const LAYER_IDS: LayerType[] = ['temperature', 'wind', 'insolation'];

  return (
    <Container>
      <MapContainer>
        {LAYER_IDS.map((layerId) => (
          <LayerTile key={layerId} layerId={layerId} />
        ))}
      </MapContainer>

      <MapLegend>
        <LegendTitle>Цветовая схема слоев</LegendTitle>
        <LegendItems>
          {LAYER_IDS.map((layerId) => (
            <LegendItem key={layerId}>
              <LegendColorBox $color={LAYER_COLORS[layerId]} />
              <LegendLabel>{LAYER_NAMES[layerId]}</LegendLabel>
            </LegendItem>
          ))}
        </LegendItems>
      </MapLegend>
    </Container>
  );
};

export default memo(MapVisualization);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MapContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  min-height: 500px;
`;

const Tile = styled.div<{ $enabled: boolean; $color: string; $opacity: number }>`
  background: ${({ $enabled, $color, $opacity }) =>
    $enabled
      ? `linear-gradient(135deg, ${$color}${Math.round($opacity * 40).toString(16).padStart(2, '0')}, ${$color}${Math.round($opacity * 20).toString(16).padStart(2, '0')})`
      : '#f5f5f5'};
  border: 2px solid ${({ $enabled, $color }) => ($enabled ? $color : '#ddd')};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  ${({ $enabled }) =>
    $enabled &&
    `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `}
`;

const TileHeader = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TileName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ $status }) => {
    switch ($status) {
      case 'loading':
        return '#ffa500';
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#999';
    }
  }};
  color: white;
`;

const TileContent = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const DisabledOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #999;
`;

const DisabledIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const DisabledText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const SuccessContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const DataVisualization = styled.div<{ $color: string; $opacity: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${({ $color }) => $color};
  opacity: ${({ $opacity }) => $opacity};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const DataPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.1) 10px,
      rgba(255, 255, 255, 0.1) 20px
    );
`;

const DataInfo = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DataIcon = styled.div`
  font-size: 48px;
`;

const OpacityInfo = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const ErrorOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
`;

const ErrorText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #f44336;
`;

const ErrorHint = styled.div`
  font-size: 13px;
  color: #999;
  max-width: 200px;
`;

const MapLegend = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
`;

const LegendTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #555;
`;

const LegendItems = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColorBox = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const LegendLabel = styled.div`
  font-size: 13px;
  color: #666;
`;
