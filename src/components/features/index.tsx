import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Features = ({ enableFeatures = false }) => {
    return (
        <>
            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🖥️</div>
                    <h3>Terminal Web Interativo</h3>
                    <p>Execute comandos shell via WebSocket com terminal nativo no navegador usando Xterm.js</p>
                    {enableFeatures && (
                        <Link to="/terminal" className="feature-link">
                            Acessar Terminal
                        </Link>
                    )}
                </div>

                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Observabilidade de Infraestrutura</h3>
                    <p>Monitoramento em tempo real de recursos do sistema, containers Docker e métricas de performance.</p>
                    {enableFeatures && (
                        <Link to="/monitoring" className="feature-link">
                            Acessar Monitoramento
                        </Link>
                    )}
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🏎️</div>
                    <h3>Power Shift</h3>
                    <p>Gerencie e configure sites Nginx de forma simples e centralizada.</p>
                    {enableFeatures && (
                        <Link to="/powershift" className="feature-link">
                            Acessar Power Shift
                        </Link>
                    )}
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>Deploy Automatizado</h3>
                    <p>Execute pipelines locais e deploy remoto via SSH/API com logs e histórico</p>
                    <div className="feature-link disabled">
                        Em breve
                    </div>
                </div>
            </section>
        </>
    );
};

export default Features;