import { useEffect } from 'react';
import './index.css';
import { useHeader } from '../../contexts/HeaderContext';
import Features from '../features';

const Panel = () => {
  const { setShowHeader } = useHeader();

  // Garante que o header permaneça oculto na página inicial
  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);
  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/icon2-light.png" alt="Nubo Panel" />
        <img src="/logo2-light.png" alt="Nubo Panel" />
      </header>

      <main className="home-main">
        <Features enableFeatures={true} />

        <section className="tech-stack">
          <h3>🚀 Tecnologias Utilizadas</h3>
          <div className="tech-list">
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
              React 19
            </span>
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" />
              Vite 7
            </span>
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" alt="Socket.IO" />
              Socket.IO
            </span>
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="Xterm.js" />
              Xterm.js
            </span>
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" />
              TypeScript
            </span>
            <span className="tech-item">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" />
              Docker API
            </span>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <p>© 2025 A6N Tecnologia. Todos os direitos reservados.</p>
          <p>Desenvolvido com ❤️ para administração moderna de infraestrutura.</p>
        </div>
      </footer>
    </div>
  );
};

export default Panel;