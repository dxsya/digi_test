import { memo } from "react";
import styled from "styled-components";
import type { LayerType } from "@/types/layers";
import { useLayer } from "@/hooks/useLayersStore";
import { layersActions } from "@/store/layersStore";

interface LayerControlProps {
	layerId: LayerType;
}

const LayerControl = ({ layerId }: LayerControlProps) => {
	const layer = useLayer(layerId);

	const handleToggle = () => {
		void layersActions.toggleLayer(layerId);
	};

	const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value);
		layersActions.setOpacity(layerId, value);
	};

	const handleRetry = () => {
		void layersActions.retryLayer(layerId);
	};

	return (
		<Container>
			<Header>
				<Title>{layer?.name ?? "NAME #" + layer.id}</Title>
				<StatusBadge $status={layer.status}>{layer.status}</StatusBadge>
			</Header>

			<Controls>
				<ControlRow>
					<Label>Включен:</Label>
					<Toggle
						type="checkbox"
						checked={layer.enabled}
						onChange={handleToggle}
						disabled={layer.status === "loading"}
					/>
				</ControlRow>

				<ControlRow>
					<Label>Прозрачность:</Label>
					<OpacityControl>
						<Slider
							type="range"
							min="0"
							max="1"
							step="0.1"
							value={layer.opacity}
							onChange={handleOpacityChange}
							disabled={!layer.enabled}
						/>
						<OpacityValue>{Math.round(layer.opacity * 100)}%</OpacityValue>
					</OpacityControl>
				</ControlRow>

				{layer.status === "error" && (
					<ErrorBlock>
						<ErrorMessage>{layer.error || "Ошибка загрузки"}</ErrorMessage>
						<RetryButton onClick={handleRetry}>Повторить загрузку</RetryButton>
					</ErrorBlock>
				)}

				{layer.status === "success" && layer.enabled && (
					<SuccessBlock>
						<SuccessIcon>✓</SuccessIcon>
						<SuccessText>Данные загружены</SuccessText>
					</SuccessBlock>
				)}
			</Controls>
		</Container>
	);
};

export default memo(LayerControl);

const Container = styled.div`
	background: #f5f5f5;
	border: 1px solid #ddd;
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 12px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

const Title = styled.h3`
	margin: 0;
	font-size: 18px;
	font-weight: 600;
`;

const StatusBadge = styled.span<{ $status: string }>`
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	text-transform: uppercase;
	background: ${({ $status }) => {
		switch ($status) {
			case "loading":
				return "#ffa500";
			case "success":
				return "#4caf50";
			case "error":
				return "#f44336";
			default:
				return "#999";
		}
	}};
	color: white;
`;

const Controls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const ControlRow = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const Label = styled.label`
	font-weight: 500;
	min-width: 120px;
`;

const Toggle = styled.input`
	width: 20px;
	height: 20px;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
`;

const OpacityControl = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
`;

const Slider = styled.input`
	flex: 1;
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
`;

const OpacityValue = styled.span`
	min-width: 45px;
	text-align: right;
	font-weight: 500;
`;

const ErrorBlock = styled.div`
	background: #ffebee;
	border: 1px solid #f44336;
	border-radius: 4px;
	padding: 12px;
	margin-top: 8px;
`;

const ErrorMessage = styled.p`
	margin: 0 0 8px 0;
	color: #c62828;
	font-size: 14px;
`;

const RetryButton = styled.button`
	background: #f44336;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 16px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;

	&:hover {
		background: #d32f2f;
	}

	&:active {
		background: #c62828;
	}
`;

const SuccessBlock = styled.div`
	background: #e8f5e9;
	border: 1px solid #4caf50;
	border-radius: 4px;
	padding: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const SuccessIcon = styled.span`
	color: #4caf50;
	font-weight: bold;
	font-size: 16px;
`;

const SuccessText = styled.span`
	color: #2e7d32;
	font-size: 14px;
	font-weight: 500;
`;
