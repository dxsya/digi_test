import styled from "styled-components";
import LayerControl from "@/components/LayerControl";
import MapVisualization from "@/components/MapVisualization";
import type { LayerType } from "@/types/layers";

const LAYER_IDS: LayerType[] = ["temperature", "wind", "insolation"];

const LayersList = () => {
	return (
		<Container>
			<Title>Управление картографическими слоями</Title>

			<Layout>
				<MapSection>
					<SectionTitle>Карта</SectionTitle>
					<MapVisualization />
				</MapSection>

				<ControlsSection>
					<SectionTitle>Управление слоями</SectionTitle>
					<LayersContainer>
						{LAYER_IDS.map((layerId) => (
							<LayerControl key={layerId} layerId={layerId} />
						))}
					</LayersContainer>
				</ControlsSection>
			</Layout>
		</Container>
	);
};

export default LayersList;

const Container = styled.div`
	max-width: 1400px;
	margin: 0 auto;
	padding: 24px;
`;

const Title = styled.h1`
	font-size: 28px;
	margin-bottom: 24px;
	color: #333;
	text-align: center;
`;

const Layout = styled.div`
	display: grid;
	grid-template-columns: 1fr 400px;
	gap: 24px;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
	}
`;

const MapSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const ControlsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const SectionTitle = styled.h2`
	font-size: 20px;
	margin: 0;
	color: #555;
	font-weight: 600;
`;

const LayersContainer = styled.div`
	display: flex;
	flex-direction: column;
`;
