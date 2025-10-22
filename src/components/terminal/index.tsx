import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useHeader } from '../../contexts/HeaderContext';

const BASE_SOCKET_URL: string = import.meta.env.VITE_SOCKET_URL as string;
const TOKEN : string = import.meta.env.VITE_TOKEN as string;

// Configurações do terminal
const TERMINAL_OPTIONS = {
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontSize: 14,
  lineHeight: 1.2,
  cursorBlink: true,
  cursorStyle: 'bar',
  theme: {
    background: '#001838',
    foreground: '#f8f8f8',
    cursor: '#f8f8f8',
    black: '#000000',
    red: '#e06c75',
    green: '#4dac0a',
    yellow: '#e5c07b',
    blue: '#61afef',
    magenta: '#c678dd',
    cyan: '#56b6c2',
    white: '#dcdfe4',
    brightBlack: '#5c6370',
    brightRed: '#e06c75',
    brightGreen: '#33DA7A',
    brightYellow: '#e5c07b',
    brightBlue: '#61afef',
    brightMagenta: '#c678dd',
    brightCyan: '#56b6c2',
    brightWhite: '#dcdfe4'
  }
};

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<XTerminal | null>(null);
  const socketInstance = useRef<WebSocket | null>(null);
  const { setShowHeader } = useHeader();

  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);

  useEffect(() => {
  let term: XTerminal;
  let ws: WebSocket;

    const loadScripts = async () => {
  term = new XTerminal(TERMINAL_OPTIONS);
  term.open(terminalRef.current);
  term.focus();

      // Monta a URL do WebSocket puro
      const wsUrl = `${BASE_SOCKET_URL.replace(/^http/, 'ws')}/terminal?token=${TOKEN}`;
      ws = new window.WebSocket(wsUrl);

      ws.onopen = () => {
        resizeTerminal();
      };

      let lastCommand = '';
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'output' && msg.data) {
            // Filtra o comando digitado da primeira linha do output
            let output = msg.data;
            const lines = output.split('\n');
            if (lines.length > 1 && lines[0].trim() === lastCommand.trim()) {
              output = lines.slice(1).join('\n');
            }
            term.write(output);
          }
        } catch {
          term.write(event.data); // fallback para texto puro
        }
      };

      ws.onerror = () => {
        term.write('\r\nErro na conexão WebSocket\r\n');
      };

      ws.onclose = () => {
        term.write('\r\nConexão encerrada\r\n');
      };

      let inputBuffer = '';
      term.onKey(({ key, domEvent }) => {
        if (domEvent.key === 'Enter') {
          lastCommand = inputBuffer;
          term.write('\r\n');
          ws.send(JSON.stringify({ type: 'input', data: inputBuffer + '\n' }));
          inputBuffer = '';
        } else if (domEvent.key === 'Backspace') {
          // Remove último caractere do buffer e do terminal
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            term.write('\b \b');
          }
        } else if (domEvent.key.length === 1) {
          inputBuffer += key;
          term.write(key);
        }
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      const resizeTerminal = () => {
        setTimeout(() => {
          fitAddon.fit();
          ws.send(JSON.stringify({
            type: 'resize',
            cols: term.cols,
            rows: term.rows,
          }));
          term.focus();
        }, 100);
      };

      window.addEventListener("resize", resizeTerminal);

      termInstance.current = term;
      socketInstance.current = ws;

      return () => {
        window.removeEventListener("resize", resizeTerminal);
        term.dispose();
        ws.close();
      };
    };

    loadScripts();

    return () => {
      if (termInstance.current) termInstance.current.dispose();
      if (socketInstance.current) socketInstance.current.close();
    };
  }, []);

  return (
    <>
  {/* xterm.css já importado via import */}
      <style>{`
        .xterm {
          height: 100% !important;
          width: 100% !important;
        }
        .xterm-viewport {
          height: 100% !important;
          width: 100% !important;
        }
        .xterm-screen {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        fontFamily: 'Alexandria, sans-serif'
      }}>
        {/* Header do Terminal */}
        <div style={{
          background: '#130A1B',
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(116, 81, 171, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          <Link 
            to="/" 
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: 'rgba(116, 81, 171, 0.15)',
              borderRadius: '6px',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(116, 81, 171, 0.25)';
              target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = 'rgba(116, 81, 171, 0.15)';
              target.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            ← Voltar ao Início
          </Link>
        </div>

        {/* Terminal */}
        <div
          id="terminal"
          ref={terminalRef}
            tabIndex={0}
          style={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            padding: "0 0 0 10px",
            margin: "0",
            boxSizing: "border-box",
            minHeight: "300px",
            height: "100%",
            width: "100%"
          }}
        ></div>

        {/* Rodapé do Terminal */}
        <div style={{
          background: '#2B2B2D',
          padding: '0.75rem 2rem',
          borderTop: '1px solid rgba(116, 81, 171, 0.3)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <p style={{ margin: 0 }}>
            Terminal conectado via WebSocket • Use Ctrl+C para interromper comandos
          </p>
        </div>
      </div>
    </>
  );
};

export default Terminal;
