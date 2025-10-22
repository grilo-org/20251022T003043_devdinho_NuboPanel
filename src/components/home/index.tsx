import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useHeader } from '../../contexts/HeaderContext';
import Features from '../features';

const Home = () => {
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
        <section className="login">
          <div className='login-text'>
            <h2>Bem-vindo ao Nubo Panel</h2>
            <p>O painel administrativo e operacional moderno para gerenciar sua infraestrutura de forma eficiente e segura.</p>
          </div>
            
            <Link 
            to="/login" 
            className="login-button"
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
            Acessar Painel →
            </Link>
        </section>

        <Features />

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

export default Home;