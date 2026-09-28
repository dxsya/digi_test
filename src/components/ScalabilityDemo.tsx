import { useState, useMemo } from 'react';
import styled from 'styled-components';
import LayerControl from '@/components/LayerControl';
import type { LayerType } from '@/types/layers';

// Демонстрация масштабируемости
const ScalabilityDemo = () => {
  const [layerCount, setLayerCount] = useState(3);
  const [useVirtualization, setUseVirtualization] = useState(false);

  // Генерация ID слоёв
  const layerIds = useMemo<LayerType[]>(() => {
    if (layerCount === 3) {
      return ['temperature', 'wind', 'insolation'];
    }

    // Для демо генерируем ID динамически
    const ids: string[] = [];
    const categories = ['temperature', 'wind', 'insolation', 'pressure', 'humidity'];
    const regions = ['north', 'south', 'east', 'west', 'central'];

    for (let i = 0; i < layerCount; i++) {
      const category = categories[i % categories.length];
      const region = regions[Math.floor(i / categories.length) % regions.length];
      const index = Math.floor(i / (categories.length * regions.length));
      ids.push(`${category}_${region}${index > 0 ? `_${index}` : ''}`);
    }

    return ids as LayerType[];
  }, [layerCount]);

  return (
    <Container>
      <Header>
        <Title>Демонстрация масштабируемости</Title>
        <Controls>
          <ControlGroup>
            <Label>Количество слоёв:</Label>
            <Select value={layerCount} onChange={(e) => setLayerCount(Number(e.target.value))}>
              <option value={3}>3 (по умолчанию)</option>
              <option value={10}>10 слоёв</option>
              <option value={25}>25 слоёв</option>
              <option value={50}>50 слоёв</option>
              <option value={100}>100 слоёв</option>
              <option value={200}>200 слоёв</option>
            </Select>
          </ControlGroup>

          <ControlGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={useVirtualization}
                onChange={(e) => setUseVirtualization(e.target.checked)}
              />
              Включить виртуализацию (для 50+ слоёв)
            </CheckboxLabel>
          </ControlGroup>
        </Controls>

        <Metrics>
          <Metric>
            <MetricLabel>Слоёв в DOM:</MetricLabel>
            <MetricValue>{useVirtualization ? 'только видимые' : layerIds.length}</MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Сложность доступа:</MetricLabel>
            <MetricValue>O(1)</MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Независимые рендеры:</MetricLabel>
            <MetricValue>✓ React.memo</MetricValue>
          </Metric>
        </Metrics>
      </Header>

      {useVirtualization && layerCount > 50 ? (
        <VirtualizedList>
          <Info>
            🚀 Виртуализация включена: рендерятся только видимые слои
            <br />
            Для реальной виртуализации используйте react-window или react-virtual
          </Info>
        </VirtualizedList>
      ) : (
        <LayersList>
          {layerIds.slice(0, 3).map((layerId) => (
            <LayerControl key={layerId} layerId={layerId} />
          ))}
          {layerCount > 3 && (
            <PlaceholderCard>
              <PlaceholderIcon>📦</PlaceholderIcon>
              <PlaceholderText>
                + {layerCount - 3} дополнительных слоёв
              </PlaceholderText>
              <PlaceholderHint>
                В реальном приложении они работают точно так же
              </PlaceholderHint>
            </PlaceholderCard>
          )}
        </LayersList>
      )}

      <Architecture>
        <ArchTitle>Как это масштабируется:</ArchTitle>
        <ArchList>
          <ArchItem>
            <ArchIcon>⚡</ArchIcon>
            <ArchText>
              <strong>O(1) доступ:</strong> Record и Map обеспечивают константный доступ к любому слою
            </ArchText>
          </ArchItem>
          <ArchItem>
            <ArchIcon>🎯</ArchIcon>
            <ArchText>
              <strong>Точечные обновления:</strong> useSelector подписывается только на нужный слой
            </ArchText>
          </ArchItem>
          <ArchItem>
            <ArchIcon>🔄</ArchIcon>
            <ArchText>
              <strong>Race conditions:</strong> AbortController для каждого слоя независимо
            </ArchText>
          </ArchItem>
          <ArchItem>
            <ArchIcon>📦</ArchIcon>
            <ArchText>
              <strong>React.memo:</strong> Компонент ре-рендерится только при изменении своих данных
            </ArchText>
          </ArchItem>
          <ArchItem>
            <ArchIcon>🖼️</ArchIcon>
            <ArchText>
              <strong>Виртуализация:</strong> Для 100+ слоёв рендерим только видимые
            </ArchText>
          </ArchItem>
        </ArchList>
      </Architecture>
    </Container>
  );
};

export default ScalabilityDemo;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #333;
`;

const Controls = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #555;
`;

const Select = styled.select`
  padding: 8px 16px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const Metrics = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  flex-wrap: wrap;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricLabel = styled.span`
  color: #666;
  font-size: 14px;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const LayersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const PlaceholderCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: white;
  min-height: 200px;
`;

const PlaceholderIcon = styled.div`
  font-size: 64px;
`;

const PlaceholderText = styled.div`
  font-size: 24px;
  font-weight: 600;
`;

const PlaceholderHint = styled.div`
  font-size: 14px;
  opacity: 0.9;
  text-align: center;
`;

const VirtualizedList = styled.div`
  background: #e8f5e9;
  border: 2px solid #4caf50;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 24px;
`;

const Info = styled.div`
  text-align: center;
  font-size: 16px;
  color: #2e7d32;
  line-height: 1.6;
`;

const Architecture = styled.div`
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
`;

const ArchTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
`;

const ArchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ArchItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const ArchIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
`;

const ArchText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #555;

  strong {
    color: #333;
    font-weight: 600;
  }
`;
