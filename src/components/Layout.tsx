import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import { useHeader } from '../contexts/HeaderContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { showHeader } = useHeader();

  return (
    <>
      <div className="layout-container">
        {showHeader && (
          <header id="header">
            <nav className="main-nav">
              <div className="nav-brand">
                <Link to="/">
                  <h1>
                    <img src="/logo-light.png" alt="Nubo Panel" />
                  </h1>
                </Link>
              </div>
              <ul className="nav-links">
                <li>
                  <Link 
                    to="/panel" 
                    className={location.pathname === '/panel' ? 'active' : ''}
                  >
                    Painel
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terminal" 
                    className={location.pathname === '/terminal' ? 'active' : ''}
                  >
                    Terminal
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/monitoring" 
                    className={location.pathname === '/monitoring' ? 'active' : ''}
                  >
                    Monitoramento
                  </Link>
                </li>
                <li>
                  <span className="nav-link disabled">Deploy</span>
                </li>
                  <li>
                    <Link
                      to="/powershift"
                      className={location.pathname === '/powershift' ? 'active' : ''}
                    >
                      PowerShift
                    </Link>
                  </li>
              </ul>
            </nav>
          </header>
        )}
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
}