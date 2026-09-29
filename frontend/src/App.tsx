import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { DatasetLab } from './pages/DatasetLab';
import { ExperimentStudio } from './pages/ExperimentStudio';
import { ExperimentTimeline } from './pages/ExperimentTimeline';
import { OptimizationLab } from './pages/OptimizationLab';
import { ModelComparison } from './pages/ModelComparison';
import { ReportView } from './pages/ReportView';
import { SettingsPage } from './pages/SettingsPage';
import { apiClient } from './api/client';
import { Dataset, OptimizationRun, SystemHealth } from './types';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'workspace'>('workspace');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentRun, setCurrentRun] = useState<OptimizationRun | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);

  // Initialize datasets & system health
  const refreshHealth = async () => {
    try {
      const h = await apiClient.getHealth();
      setSystemHealth(h);
    } catch (e) {
      console.warn('Backend not responding yet:', e);
    }
  };

  const loadInitialDatasets = async () => {
    try {
      const list = await apiClient.getDatasets();
      setDatasets(list);
    } catch (e) {
      console.warn('Could not load datasets on boot:', e);
    }
  };

  useEffect(() => {
    refreshHealth();
    loadInitialDatasets();
  }, []);

  // Demo loader (Section 51)
  const handleLoadDemo = async () => {
    try {
      const demoData = await apiClient.getBreastCancerDemo();
      setCurrentRun(demoData);
      setIsDemoActive(true);
      setViewMode('workspace');
      setCurrentTab('dashboard');
    } catch (e) {
      console.error('Failed to load demo run:', e);
    }
  };

  // If viewing landing page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchWorkspace={() => setViewMode('workspace')}
        onLaunchDemo={handleLoadDemo}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-lab-bg text-lab-text">
      {/* Compact Laboratory Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        systemHealth={systemHealth}
        onLoadDemo={handleLoadDemo}
        isDemoActive={isDemoActive}
      />

      {/* Main Execution Surface */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          isDemoActive={isDemoActive}
          onExitToLanding={() => setViewMode('landing')}
        />

        <main className="flex-1 overflow-y-auto lab-grid-bg">
          {currentTab === 'dashboard' && (
            <Dashboard
              currentRun={currentRun}
              onNavigate={setCurrentTab}
              onLoadDemo={handleLoadDemo}
              systemHealth={systemHealth}
            />
          )}

          {currentTab === 'datasets' && (
            <DatasetLab
              onSelectDatasetForExperiment={(ds) => {
                setCurrentTab('studio');
              }}
            />
          )}

          {currentTab === 'studio' && (
            <ExperimentStudio
              datasets={datasets}
              currentRun={currentRun}
              setCurrentRun={(run) => {
                setCurrentRun(run);
                setIsDemoActive(run?.is_demo || false);
              }}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'timeline' && (
            <ExperimentTimeline currentRun={currentRun} />
          )}

          {currentTab === 'optimization' && (
            <OptimizationLab
              currentRun={currentRun}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'comparison' && (
            <ModelComparison currentRun={currentRun} />
          )}

          {currentTab === 'report' && (
            <ReportView currentRun={currentRun} />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              systemHealth={systemHealth}
              onRefreshHealth={refreshHealth}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
