import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './components/home';
import Terminal from './components/terminal';
import Monitoring from './components/monitoring';
import PowerShift from './components/powershift';
import { HeaderProvider } from './contexts/HeaderContext';

function App() {
  return (
    <HeaderProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/terminal" element={
            <Layout>
              <Terminal />
            </Layout>
          } />
          <Route path="/monitoring" element={
            <Layout>
              <Monitoring />
            </Layout>
          } />
          <Route path="/powershift" element={
            <Layout>
              <PowerShift />
            </Layout>
          } />
        </Routes>
      </Router>
    </HeaderProvider>
  );
}

export default App;