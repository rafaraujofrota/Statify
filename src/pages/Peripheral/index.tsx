import { useState, useRef, useEffect, useCallback, type RefObject } from 'react';
import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";
import { PageContainer, SplitContainer, TestContainer } from "./styles";
import { FaKeyboard, FaMouse, FaCamera } from "react-icons/fa";
import { BiSolidJoystick } from "react-icons/bi";

// pro teste de teclado, salvar a tecla, travar a tela e etc
function useKeyCapture(
	initialText = '',
	buttonRef?: RefObject<HTMLElement | null>
) {
	const [isListening, setIsListening] = useState(false);
	const [capturedKey, setCapturedKey] = useState<string | null>(null);

	useEffect(() => {
		if (!isListening) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			const keyName = event.key === ' ' ? 'Espaço' : event.key;
			setCapturedKey(keyName);
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (buttonRef?.current && !buttonRef.current.contains(event.target as Node)) {
				setIsListening(false);
				setCapturedKey(null);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousedown', handleClickOutside);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isListening, buttonRef]);

	const startListening = () => {
		setCapturedKey(null);
		setIsListening(true);
	};

	const buttonText = !isListening ? initialText : (capturedKey ?? '');

	return { buttonText, isListening, startListening };
}

// pro mouse
function useMouseTracker() {
	const [leftClicks, setLeftClicks] = useState(0);
	const [rightClicks, setRightClicks] = useState(0);
	const [middleClicks, setMiddleClicks] = useState(0);
	const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			setClickTimestamps((prev) => prev.filter((time) => now - time <= 1000));
		}, 100);

		return () => clearInterval(interval);
	}, []);

	const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		const now = Date.now();

		setClickTimestamps((prev) => [...prev.filter((time) => now - time <= 1000), now]);

		if (e.button === 0) {
			setLeftClicks((prev) => prev + 1);
		} else if (e.button === 1) {
			e.preventDefault();
			setMiddleClicks((prev) => prev + 1);
		} else if (e.button === 2) {
			setRightClicks((prev) => prev + 1);
		}
	};

	const resetClicks = () => {
		setLeftClicks(0);
		setRightClicks(0);
		setMiddleClicks(0);
		setClickTimestamps([]);
	};

	return {
		leftClicks,
		rightClicks,
		middleClicks,
		cps: clickTimestamps.length,
		handleMouseDown,
		resetClicks,
	};
}

// pro mic/cam
function useMicVisualizer(stream: MediaStream | null, canvasRef: RefObject<HTMLCanvasElement | null>) {
	useEffect(() => {
		if (!stream || !canvasRef.current) return;

		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 64;
		analyser.smoothingTimeConstant = 0.85;

		const source = audioContext.createMediaStreamSource(stream);
		source.connect(analyser);

		const dataArray = new Uint8Array(analyser.frequencyBinCount);
		let animationFrameId: number;

		const syncCanvasSize = () => {
			const canvas = canvasRef.current;
			const parent = canvas?.parentElement;
			if (!canvas || !parent) return;

			const rect = parent.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;
			const targetWidth = Math.max(1, Math.round(rect.width * dpr));
			const targetHeight = Math.max(1, Math.round(rect.height * dpr));

			if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
				canvas.width = targetWidth;
				canvas.height = targetHeight;
			}
		};

		const draw = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			syncCanvasSize();

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			analyser.getByteFrequencyData(dataArray);

			const dpr = window.devicePixelRatio || 1;
			const width = canvas.width / dpr;
			const height = canvas.height / dpr;

			ctx.save();
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, width, height);

			const barCount = 12;
			const gap = 4;
			const totalGap = gap * (barCount - 1);
			const barWidth = Math.max(3, Math.floor((width - totalGap) / barCount));
			const idleHeight = Math.max(8, Math.round(height * 0.18));
			const bottomPadding = 0;

			for (let i = 0; i < barCount; i++) {
				const sampleIndex = Math.min(dataArray.length - 1, i * 2);
				const raw = dataArray[sampleIndex] / 255;
				const level = raw < 0.06 ? 0 : Math.min(1, (raw - 0.06) * 1.35);

				const dynamicHeight = Math.round(
					idleHeight + level * Math.max(0, height - idleHeight - bottomPadding - 6)
				);

				const x = Math.round(5 + i * (barWidth + gap));
				const y = Math.round(height - dynamicHeight - bottomPadding);

				ctx.fillStyle = level > 0.45 ? '#e0821d' : '#f7c627';
				ctx.fillRect(x, y, barWidth, dynamicHeight);
			}

			ctx.restore();
			animationFrameId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
			source.disconnect();
			audioContext.close();
		};
	}, [stream, canvasRef]);
}

export function Peripheral() {
	const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
	const micCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const testRef = useRef<HTMLDivElement | null>(null);
	const micTestRef = useRef<HTMLDivElement | null>(null);

	const { buttonText, isListening, startListening } = useKeyCapture('Testar Teclado', buttonRef);
	const [isSplit1, setSplit1] = useState(false);
	const [isSplit2, setSplit2] = useState(false);
	const { leftClicks, rightClicks, middleClicks, cps, handleMouseDown, resetClicks } = useMouseTracker();

	const stopMediaTest = useCallback(() => {
		cameraStream?.getTracks().forEach((track) => track.stop());
		setCameraStream(null);
		setSplit2(false);
	}, [cameraStream]);

	const startMediaTest = async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			console.warn('getUserMedia não disponível neste contexto (use HTTPS ou localhost).');
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});

			setCameraStream(stream);
			setSplit2(true);
		} catch (error) {
			console.error('Permissão de câmera/microfone negada ou indisponível:', error);
		}
	};

	useEffect(() => {
		if (!isSplit1) return;
	
		const handleClickOutside = (event: MouseEvent) => {
			if (testRef.current && !testRef.current.contains(event.target as Node)) {
				setSplit1(false);
			}
		};
	
		window.addEventListener('mousedown', handleClickOutside);
		return () => {
			window.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSplit1]);

	useEffect(() => {
		if (!isSplit2) return;
	
		const handleClickOutside = (event: MouseEvent) => {
			if (micTestRef.current && !micTestRef.current.contains(event.target as Node)) {
				stopMediaTest();
			}
		};
	
		window.addEventListener('mousedown', handleClickOutside);
		return () => {
			window.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSplit2, stopMediaTest]);

	useEffect(() => {
		if (videoRef.current && cameraStream) {
			videoRef.current.srcObject = cameraStream;
		}
	}, [cameraStream, isSplit2]);

	useEffect(() => {
		return () => {
			cameraStream?.getTracks().forEach((track) => track.stop());
		};
	}, [cameraStream]);

	useMicVisualizer(isSplit2 ? cameraStream : null, micCanvasRef);

	const mouseStats = [
		{ label: 'Esquerdo', value: leftClicks },
		{ label: 'Direito', value: rightClicks },
		{ label: 'Scroll', value: middleClicks },
		{ label: 'CPS', value: cps },
	];

	return (
		<PageContainer>
			<TitleBar diagnosis={100} subtitle="DISPOSITIVOS CONECTADOS" title="Informações do Periféricos" />

			<div className="infoCardContainer">
				<InfoCard Icon={FaKeyboard} title="Teste de Teclado">
					<TestContainer>
						<span style={{ minHeight: "275px" }}>
							<div className="TestContainer">
								<button
									ref={buttonRef}
									type="button"
									className={isListening ? 'TestButtonActive' : 'TestButton'}
									onClick={startListening}
								>
									{buttonText}
								</button>
							</div>
						</span>
					</TestContainer>
				</InfoCard>

				<InfoCard Icon={FaMouse} title="Teste de Mouse">
					<SplitContainer $direction="column" ref={testRef}>
						{!isSplit1 ? (
							<TestContainer>
								<span>
									<button
										type="button"
										className="TestButton"
										onClick={() => {
											resetClicks();
											setSplit1(true);
										}}
									>
										Testar Mouse
									</button>
								</span>
							</TestContainer>
						) : (
							<>
								<TestContainer $ratio={2}>
									<span
										onMouseDown={handleMouseDown}
										onContextMenu={(e) => e.preventDefault()}
										style={{ cursor: "pointer", userSelect: "none" }}
									>
										<h5>Mouse Pad</h5>
									</span>
								</TestContainer>
								<TestContainer $ratio={1}>
									<span>
										<h5
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-evenly",
												width: "100%",
												whiteSpace: "nowrap",
												margin: 0,
											}}
										>
											{mouseStats.map(({ label, value }) => (
												<span
													key={label}
													style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
												>
													<span>{label}</span>
													<strong>{value}</strong>
												</span>
											))}
										</h5>
									</span>
								</TestContainer>
							</>
						)}
					</SplitContainer>
				</InfoCard>
			</div>

			<div className="infoCardContainer">
				<InfoCard Icon={BiSolidJoystick} title="Teste de Controle">
					<TestContainer>
						<span style={{ minHeight: "275px" }}>
							<button
								type="button"
								className="TestButton"
								onFocus={(e) => {
									e.currentTarget.style.opacity = "0";
									e.currentTarget.style.pointerEvents = "none";
								}}
								onBlur={(e) => {
									e.currentTarget.style.opacity = "1";
									e.currentTarget.style.pointerEvents = "auto";
								}}
							>
								Testar Controle
							</button>
						</span>
					</TestContainer>
				</InfoCard>

				<InfoCard Icon={FaCamera} title="Câmera e microfone">
					<SplitContainer $direction="row" ref={micTestRef}>
						{!isSplit2 ? (
							<TestContainer>
								<span>
									<button
										type="button"
										className="TestButton"
										onClick={startMediaTest}
									>
										Permissão para Teste
									</button>
								</span>
							</TestContainer>
						) : (
							<>
								<TestContainer $ratio={3}>
									<span style={{ padding: 0, overflow: "hidden" }}>
										<video
											ref={videoRef}
											autoPlay
											playsInline
											muted
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												display: "block",
											}}
										/>
									</span>
								</TestContainer>
								<TestContainer $ratio={1}>
									<span
										style={{
											position: "relative",
											padding: 0,
											width: "100%",
											height: "100%",
											minWidth: 0,
											minHeight: 0,
											overflow: "hidden",
										}}
									>
										<canvas
											ref={micCanvasRef}
											style={{
												position: "absolute",
												inset: 0,
												width: "100%",
												height: "100%",
												display: "block",
											}}
										/>
									</span>
								</TestContainer>
							</>
						)}
					</SplitContainer>
				</InfoCard>
			</div>
		</PageContainer>
	);
}