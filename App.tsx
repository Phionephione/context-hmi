
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Architecture = lazy(() => import('./pages/Architecture'));
const Simulation = lazy(() => import('./pages/Simulation'));
const Methodology = lazy(() => import('./pages/Methodology'));
const Results = lazy(() => import('./pages/Results'));

const Loading = () => (
  <div className="h-[80vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">INITIALIZING SYSTEM...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
