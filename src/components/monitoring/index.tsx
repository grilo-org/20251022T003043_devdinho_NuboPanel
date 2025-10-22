import { useState, useEffect, useRef } from 'react';
import { useHeader } from '../../contexts/HeaderContext';
import './index.css';

interface SystemInfo {
  cpu_usage_percent: number;
  memory_total: number;
  memory_available: number;
  memory_percent: number;
  disk_total: number;
  disk_used: number;
  disk_percent: number;
  network_sent: number;
  network_recv: number;
}

interface DockerStats {
  BlockIO: string;
  CPUPerc: string;
  Container: string;
  ID: string;
  MemPerc: string;
  MemUsage: string;
  Name: string;
  NetIO: string;
  PIDs: string;
}

const Monitoring = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [containers, setContainers] = useState<DockerStats[]>([]);
  const [isSystemConnected, setIsSystemConnected] = useState(false);
  const [isDockerConnected, setIsDockerConnected] = useState(false);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [dockerError, setDockerError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const systemSocketRef = useRef<WebSocket | null>(null);
  const dockerSocketRef = useRef<WebSocket | null>(null);
  const { setShowHeader } = useHeader();

  // Ativa o header quando o componente é montado
  useEffect(() => {
    setShowHeader(true);
    return () => setShowHeader(false);
  }, [setShowHeader]);

  useEffect(() => {
    const token = import.meta.env.VITE_TOKEN;
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    
    if (!token) {
      setSystemError('Token não encontrado no arquivo .env');
      setDockerError('Token não encontrado no arquivo .env');
      return;
    }

    if (!socketUrl) {
      setSystemError('URL do socket não encontrada no arquivo .env');
      setDockerError('URL do socket não encontrada no arquivo .env');
      return;
    }

    // Conectar ao WebSocket do sistema
    const connectSystemWebSocket = () => {
      try {
        const wsUrl = socketUrl.replace(/^http/, 'ws') + '/system-info';
        const ws = new WebSocket(`${wsUrl}?token=${token}`);

        ws.onopen = () => {
          console.log('Conectado ao WebSocket System Info');
          setIsSystemConnected(true);
          setSystemError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setSystemInfo(data);
          } catch (err) {
            console.error('Erro ao parsear dados do sistema:', err);
            setSystemError('Erro ao processar dados do sistema');
          }
        };

        ws.onclose = () => {
          console.log('Conexão WebSocket do sistema fechada');
          setIsSystemConnected(false);
          setTimeout(connectSystemWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('Erro no WebSocket do sistema:', error);
          setSystemError('Erro na conexão WebSocket do sistema');
          setIsSystemConnected(false);
        };

        systemSocketRef.current = ws;
      } catch (err) {
        console.error('Erro ao criar WebSocket do sistema:', err);
        setSystemError('Erro ao estabelecer conexão do sistema');
      }
    };

    // Conectar ao WebSocket do Docker
    const connectDockerWebSocket = () => {
      try {
        const wsUrl = socketUrl.replace(/^http/, 'ws') + '/docker-stats';
        const ws = new WebSocket(`${wsUrl}?token=${token}`);

        ws.onopen = () => {
          console.log('Conectado ao WebSocket Docker Stats');
          setIsDockerConnected(true);
          setDockerError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setContainers(data);
          } catch (err) {
            console.error('Erro ao parsear dados do Docker:', err);
            setDockerError('Erro ao processar dados do Docker');
          }
        };

        ws.onclose = () => {
          console.log('Conexão WebSocket do Docker fechada');
          setIsDockerConnected(false);
          setTimeout(connectDockerWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('Erro no WebSocket do Docker:', error);
          setDockerError('Erro na conexão WebSocket do Docker');
          setIsDockerConnected(false);
        };

        dockerSocketRef.current = ws;
      } catch (err) {
        console.error('Erro ao criar WebSocket do Docker:', err);
        setDockerError('Erro ao estabelecer conexão do Docker');
      }
    };

    connectSystemWebSocket();
    connectDockerWebSocket();

    return () => {
      if (systemSocketRef.current) {
        systemSocketRef.current.close();
      }
      if (dockerSocketRef.current) {
        dockerSocketRef.current.close();
      }
    };
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsageColor = (percent: number): string => {
    if (percent > 80) return '#ff4757';
    if (percent > 60) return '#ffa502';
    if (percent > 40) return '#f39c12';
    return '#2ed573';
  };

  const getDockerStatusColor = (cpuPerc: string) => {
    const cpu = parseFloat(cpuPerc.replace('%', ''));
    if (cpu > 200) return '#ff1744'; // Vermelho intenso para valores muito altos
    if (cpu > 100) return '#ff4757'; // Vermelho para valores acima de 100%
    if (cpu > 80) return '#ff6b35';  // Laranja avermelhado
    if (cpu > 50) return '#ffa502';  // Laranja
    return '#2ed573'; // Verde
  };

  const getDockerMemoryColor = (memPerc: string) => {
    const mem = parseFloat(memPerc.replace('%', ''));
    if (mem > 80) return '#ff4757';
    if (mem > 50) return '#ffa502';
    return '#2ed573';
  };

  const CircularChart = ({ percentage, color, label }: { percentage: number; color: string; label: string }) => {
    const circumference = 2 * Math.PI * 35; // raio de 35px
    
    // Para valores acima de 100%, limitamos a visualização do círculo a 100%
    // mas mantemos o valor real no texto
    const displayPercentage = Math.min(percentage, 100);
    const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;
    
    // Adiciona um círculo extra para valores acima de 100%
    const showOverflow = percentage > 100;
    const overflowPercentage = Math.min((percentage - 100) / 100, 1) * 100;
    const overflowStrokeDashoffset = circumference - (overflowPercentage / 100) * circumference;

    return (
      <div className="chart-item">
        <div className="chart-label">{label}</div>
        <div className="circular-chart-container">
          <svg className="circular-chart-svg" width="80" height="80">
            <circle
              className="chart-background"
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            <circle
              className="chart-progress"
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 40 40)"
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
            {showOverflow && (
              <circle
                className="chart-overflow"
                cx="40"
                cy="40"
                r="28"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference * 0.8}
                strokeDashoffset={overflowStrokeDashoffset * 0.8}
                transform="rotate(-90 40 40)"
                opacity="0.7"
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out'
                }}
              />
            )}
          </svg>
          <div className="chart-percentage" style={{
            color: percentage > 100 ? '#ff1744' : 'inherit',
            fontWeight: percentage > 100 ? 'bold' : 'normal'
          }}>
            {percentage.toFixed(1)}%
          </div>
        </div>
      </div>
    );
  };

  const containersPerSlide = 2;
  const totalSlides = Math.ceil(containers.length / containersPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentContainers = () => {
    const startIndex = currentSlide * containersPerSlide;
    return containers.slice(startIndex, startIndex + containersPerSlide);
  };



  const getProgressBarStyle = (percent: number) => ({
    width: `${Math.min(percent, 100)}%`,
    backgroundColor: getUsageColor(percent),
    height: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  });

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <div className="connection-status">
          <div className="status-item">
            <span>Sistema:</span>
            <span className={`status-indicator ${isSystemConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isSystemConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
          <div className="status-item">
            <span>Docker:</span>
            <span className={`status-indicator ${isDockerConnected ? 'connected' : 'disconnected'}`}></span>
            <span>{isDockerConnected ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>
      </div>

      {/* Seção do Sistema */}
      <div className="section-header">
        <h2>🖥️ Informações do Sistema</h2>
      </div>

      {systemError && (
        <div className="error-message">
          <span>⚠️ Sistema: {systemError}</span>
        </div>
      )}

      {!systemInfo && !systemError ? (
        <div className="loading-message">
          <span>📡 Aguardando dados do sistema...</span>
        </div>
      ) : systemInfo && (
        <div className="metrics-grid">
          {/* CPU */}
          <div className="metric-card tooltip" data-tooltip="CPU média do sistema (todos os cores combinados)">
            <div className="metric-header">
              <h3>🖥️ CPU</h3>
              <span className="metric-value" style={{ color: getUsageColor(systemInfo.cpu_usage_percent) }}>
                {systemInfo.cpu_usage_percent.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div style={getProgressBarStyle(systemInfo.cpu_usage_percent)}></div>
            </div>
            <p className="metric-description">Uso do processador</p>
          </div>

          {/* Memória */}
          <div className="metric-card tooltip" data-tooltip="Percentual de uso da memória RAM do sistema">
            <div className="metric-header">
              <h3>🧠 Memória</h3>
              <span className="metric-value" style={{ color: getUsageColor(systemInfo.memory_percent) }}>
                {systemInfo.memory_percent.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div style={getProgressBarStyle(systemInfo.memory_percent)}></div>
            </div>
            <p className="metric-description">
              {formatBytes(systemInfo.memory_total - systemInfo.memory_available)} / {formatBytes(systemInfo.memory_total)}
            </p>
          </div>

          {/* Disco */}
          <div className="metric-card tooltip" data-tooltip="Percentual de espaço em disco utilizado">
            <div className="metric-header">
              <h3>💾 Disco</h3>
              <span className="metric-value" style={{ color: getUsageColor(systemInfo.disk_percent) }}>
                {systemInfo.disk_percent.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div style={getProgressBarStyle(systemInfo.disk_percent)}></div>
            </div>
            <p className="metric-description">
              {formatBytes(systemInfo.disk_used)} / {formatBytes(systemInfo.disk_total)}
            </p>
          </div>

          {/* Rede */}
          <div className="metric-card network-card tooltip" data-tooltip="Dados enviados e recebidos pela rede">
            <div className="metric-header">
              <h3>🌐 Rede</h3>
            </div>
            <div className="network-stats">
              <div className="network-stat">
                <span className="network-label">📤 Enviado</span>
                <span className="network-value">{formatBytes(systemInfo.network_sent)}</span>
              </div>
              <div className="network-stat">
                <span className="network-label">📥 Recebido</span>
                <span className="network-value">{formatBytes(systemInfo.network_recv)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção do Docker */}
      <div className="section-header">
        <h2>🐳 Containers Docker</h2>
      </div>

      {dockerError && (
        <div className="error-message">
          <span>⚠️ Docker: {dockerError}</span>
        </div>
      )}

      {containers.length === 0 && !dockerError ? (
        <div className="loading-message">
          <span>📡 Aguardando dados dos containers...</span>
        </div>
      ) : containers.length > 0 ? (
        <div className="carousel-container">
          {totalSlides > 1 && (
            <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
              ‹
            </button>
          )}
          
          <div className="carousel-content">
            <div className="containers-slide">
              {getCurrentContainers().map((container) => (
                <div key={container.ID} className="container-card">
                  <div className="container-header">
                    <h3>{container.Name}</h3>
                    <span className="container-id">{container.ID.substring(0, 12)}</span>
                  </div>
                  
                  <div className="charts-section">
                     <div className="tooltip" data-tooltip="CPU total do container - valores >100% indicam uso de múltiplos cores simultaneamente">
                       <CircularChart 
                         percentage={parseFloat(container.CPUPerc.replace('%', ''))}
                         color={getDockerStatusColor(container.CPUPerc)}
                         label="CPU"
                       />
                     </div>
                     <div className="tooltip" data-tooltip="Percentual de uso da memória do container">
                       <CircularChart 
                         percentage={parseFloat(container.MemPerc.replace('%', ''))}
                         color={getDockerMemoryColor(container.MemPerc)}
                         label="Memória"
                       />
                     </div>
                   </div>
                  
                  <div className="stats-grid">
                    <div className="stat-item tooltip" data-tooltip="Quantidade de memória RAM utilizada pelo container">
                      <span className="stat-label">Uso de Memória</span>
                      <span className="stat-value">{container.MemUsage}</span>
                    </div>
                    
                    <div className="stat-item tooltip" data-tooltip="Dados enviados e recebidos pela rede do container">
                      <span className="stat-label">I/O de Rede</span>
                      <span className="stat-value">{container.NetIO}</span>
                    </div>
                    
                    <div className="stat-item tooltip" data-tooltip="Dados lidos e escritos em disco pelo container">
                      <span className="stat-label">I/O de Bloco</span>
                      <span className="stat-value">{container.BlockIO}</span>
                    </div>
                    
                    <div className="stat-item tooltip" data-tooltip="Número de processos ativos no container">
                      <span className="stat-label">PIDs</span>
                      <span className="stat-value">{container.PIDs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {totalSlides > 1 && (
            <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
              ›
            </button>
          )}
          
          {totalSlides > 1 && (
            <div className="carousel-indicators">
              {Array.from({ length: totalSlides }, (_, i) => (
                <button
                  key={i}
                  className={`indicator ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Monitoring;