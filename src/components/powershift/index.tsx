import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import React, { useState, useEffect } from 'react';
const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHeader } from '../../contexts/HeaderContext';
import './index.css';
import { Tabs, Tab } from '@mui/material';

interface NginxSite {
  id: string;
  name: string;
  domain: string;
  paths: string[];
  content: string;
  enabled: boolean;
}

const PowerShift: React.FC = () => {
  const { setShowHeader } = useHeader();
  const [sites, setSites] = useState<NginxSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<NginxSite | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setShowHeader(false);
    return () => setShowHeader(true);
  }, [setShowHeader]);

  useEffect(() => {
    fetch(`${VITE_SOCKET_URL}/powershift/sites`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar sites');
        return res.json();
      })
      .then((data: NginxSite[]) => setSites(data))
      .catch(() => setSites([]));
  }, []);

  const handleToggleStatus = (siteId: string) => {
    setSites(prevSites => 
      prevSites.map(site => 
        site.id === siteId ? { ...site, enabled: !site.enabled } : site
      )
    );
  };

  const handleCreateSite = () => {
    setIsCreating(true);
    setSelectedSite({
      id:'',
      name: '',
      domain: '',
      paths: ['/'],
      content: '',
      enabled: true
    });
  };

  const handleEditSite = (site: NginxSite) => {
    setSelectedSite(site);
    setIsEditing(true);
  };

  const handleSaveSite = () => {
    if (!selectedSite) return;

    if (isCreating) {
      setSites(prevSites => [...prevSites, selectedSite]);
    } else {
      setSites(prevSites => 
        prevSites.map(site => 
          site.id === selectedSite.id ? selectedSite : site
        )
      );
    }

    setIsCreating(false);
    setIsEditing(false);
    setSelectedSite(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedSite(null);
  };

  const handleDeleteSite = (siteId: string) => {
    if (confirm('Tem certeza que deseja excluir este site?')) {
      setSites(prevSites => prevSites.filter(site => site.id !== siteId));
    }
  };

  const handleAvancar = () => {
    setTabIndex(tabIndex + 1);
  };

  const handleVoltar = () => {
    setTabIndex(tabIndex - 1);
  };

  // Nomes das abas
  const tabLabels = ['Configuração', 'Testar configuração'];
  // const isLastTab = tabIndex === tabLabels.length - 1;

  return (
    <div className="powershift-container">
      <div className="powershift-header">
        <h1>Power Shift - Gerenciador de Sites Nginx</h1>
        <button 
          className="btn btn-primary font-bold"
          onClick={handleCreateSite}
          disabled={isCreating || isEditing}
        >
          Novo Site
        </button>
      </div>

      <div className="powershift-content">
        <div className="sites-list">
          <h2>Sites Configurados</h2>
          {sites.length === 0 ? (
            <p className="no-sites">Nenhum site configurado</p>
          ) : (
            <div className="sites-grid">
              {sites.map(site => (
                <div key={site.id} className={`site-card ${site.enabled ? 'enabled' : 'disabled'}`}>
                  <div className="site-actions-top">
                      <button 
                        className={`btn-icon ${site.enabled ? 'btn-icon-warning' : 'btn-icon-success'}`}
                        onClick={() => handleToggleStatus(site.id)}
                        title={site.enabled ? 'Desativar' : 'Ativar'}
                      >
                          <FontAwesomeIcon icon={site.enabled ? faPause : faPlay} />
                      </button>
                      <button 
                        className="btn-icon btn-icon-secondary"
                        onClick={() => handleEditSite(site)}
                        disabled={isCreating || isEditing}
                        title="Editar"
                      >
                          <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button 
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleDeleteSite(site.id)}
                        title="Excluir"
                      >
                          <FontAwesomeIcon icon={faTrash} />
                      </button>
                  </div>
                  <div className="site-header">
                    <h3>{site.name}</h3>
                    <div className="site-status">
                      <span className={`status-badge ${site.enabled ? 'active' : 'inactive'}`} >
                        {site.enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                  <div className="site-info">
                    <p><strong>Domínio:</strong> {site.domain}</p>
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      <strong>Paths:</strong>
                      {(() => {
                        // paths originais do site
                        const originalPaths = site.paths;
                        // paths atuais (editados/adicionados)
                        const currentPaths = (isCreating || isEditing) && selectedSite ? selectedSite.paths : site.paths;
                        // paths removidos: estavam antes, não estão mais
                        const removedPaths = originalPaths.filter(p => !currentPaths.includes(p));
                        // paths novos/adicionados: estão agora, não estavam antes
                        const newPaths = currentPaths.filter(p => !originalPaths.includes(p));
                        // paths mantidos: estavam antes e continuam
                        const keptPaths = currentPaths.filter(p => originalPaths.includes(p));
                        // Renderiza mantidos (verde), novos (azul), removidos (vermelho)
                        return [
                          ...keptPaths.map((path, idx) => (
                            <span
                              key={'kept-' + path + idx}
                              style={{
                                border: '2px solid #4caf50',
                                borderRadius: '6px',
                                padding: '2px 8px',
                                marginLeft: '4px',
                                fontSize: '0.95em',
                                background: '#fff',
                                color: '#333',
                              }}
                            >
                              {path}
                            </span>
                          )),
                          ...newPaths.map((path, idx) => (
                            <span
                              key={'new-' + path + idx}
                              style={{
                                border: '2px solid #2196f3',
                                borderRadius: '6px',
                                padding: '2px 8px',
                                marginLeft: '4px',
                                fontSize: '0.95em',
                                background: '#fff',
                                color: '#333',
                              }}
                            >
                              {path}
                            </span>
                          )),
                          ...removedPaths.map((path, idx) => (
                            <span
                              key={'removed-' + path + idx}
                              style={{
                                border: '2px solid #f44336',
                                borderRadius: '6px',
                                padding: '2px 8px',
                                marginLeft: '4px',
                                fontSize: '0.95em',
                                background: '#fff',
                                color: '#333',
                                opacity: 0.7,
                              }}
                            >
                              {path}
                            </span>
                          ))
                        ];
                      })()}
                    </div>
                  </div>
                  {/* O formulário de edição será renderizado fora dos cards */}
                </div>
            ))}
          </div>
        )}
        {isEditing && selectedSite && (
          <Modal open={true} onClose={() => {}} disableEscapeKeyDown>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60vw',
              height: '90vh',
              bgcolor: '#f8fafc',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              p: 4,
              borderRadius: 4,
              outline: 'none',
              border: '1px solid #e2e8f0',
            }}>
              <h2 style={{marginTop: 0, color: '#000'}}>Editar site</h2>
              {/* Tabs apenas como indicador visual, sem clique */}
              <Tabs value={tabIndex} variant="fullWidth" TabIndicatorProps={{style: {background: '#2563eb'}}} sx={{marginBottom: 2}}>
                {tabLabels.map((label) => (
                  <Tab key={label} label={label} disabled />
                ))}
              </Tabs>
              {tabIndex === 0 && (
                <form onSubmit={e => { e.preventDefault(); handleSaveSite(); }}>
                  <div style={{marginBottom: 12}}>
                    <label style={{color: '#000'}}>Nome:</label>
                    <input
                      type="text"
                      value={selectedSite.name}
                      onChange={e => setSelectedSite({...selectedSite, name: e.target.value})}
                      style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', marginTop: '4px', background: '#fff', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s'}}
                    />
                  </div>
                  <div style={{marginBottom: 12}}>
                    <label style={{color: '#000'}}>Domínio:</label>
                    <input
                      type="text"
                      value={selectedSite.domain}
                      onChange={e => setSelectedSite({...selectedSite, domain: e.target.value})}
                      style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', marginTop: '4px', background: '#fff', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s'}}
                    />
                  </div>
                  <div style={{marginBottom: 12}}>
                    <label style={{color: '#000'}}>Conteúdo (nginx.conf):</label>
                    <div style={{height: '60vh', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: 6, background: '#fff', marginTop: '4px'}}>
                      <CodeMirror
                        value={selectedSite.content}
                        extensions={[]}
                        theme={material}
                        onChange={(value) => setSelectedSite({...selectedSite, content: value})}
                        style={{width: '100%', fontSize: 14, height: '100%'}}
                      />
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
                    <button type="button" className="btn btn-primary" onClick={handleAvancar}>Avançar</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                  </div>
                </form>
              )}
              {tabIndex === 1 && (
                <div style={{marginBottom: 12}}>
                  {/* Conteúdo da aba Testar configuração pode ser implementado depois */}
                  <div style={{padding: 16, background: '#e0e7ff', borderRadius: 6, height: '75vh', overflowY: 'auto'}}>
                    <p>Conteúdo da aba Testar configuração</p>
                  </div>
                  <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16}}>
                    <button type="button" className="btn btn-secondary" onClick={handleVoltar}>Voltar</button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveSite}>Salvar</button>
                  </div>
                </div>
              )}
            </Box>
          </Modal>
        )}
        </div>
      </div>
    </div>
  );
}

export default PowerShift;