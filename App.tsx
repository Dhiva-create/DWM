import React, { useState } from 'react';
import { DwmProvider, useDwm } from './context/DwmContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { OrganogramView } from './components/OrganogramView';
import { RoleSheetView } from './components/RoleSheetView';
import { ControlGraphView } from './components/ControlGraphView';
import { StabilityCapabilityMatrix } from './components/StabilityCapabilityMatrix';
import { KpiTreeView } from './components/KpiTreeView';
import { DailyRoutineChecksheet } from './components/DailyRoutineChecksheet';
import { LogDataModal } from './components/LogDataModal';
import { ToastNotification } from './components/ToastNotification';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { GoogleDriveView } from './components/GoogleDriveView';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, setSelectedKpiId, setSelectedPositionId, kpis, dbStatus } = useDwm();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Left Sidebar Navigation */}
      <Sidebar
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Navbar
          onOpenLogModal={() => setIsLogModalOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        {/* Global Schema Pending Banner if user needs to run SQL in Supabase */}
        {dbStatus === 'schema_pending' && (
          <div className="bg-amber-500 text-amber-950 px-6 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/20 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">Database Setup Notice:</span>
              <span>
                Connected to Supabase project! Execute <code>supabase_schema.sql</code> in your Supabase SQL Editor to enable persistent PostgreSQL storage.
              </span>
            </div>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="bg-amber-900 hover:bg-amber-950 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
            >
              View SQL &amp; Instructions &rarr;
            </button>
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeView === 'organogram' && <OrganogramView />}
          {activeView === 'rolesheets' && <RoleSheetView />}
          {activeView === 'kpitree' && <KpiTreeView />}
          {activeView === 'controlgraph' && (
            <ControlGraphView onOpenLogModal={() => setIsLogModalOpen(true)} />
          )}
          {activeView === 'stability_matrix' && (
            <StabilityCapabilityMatrix
              onSelectKpi={(kpiId) => {
                setSelectedKpiId(kpiId);
                const targetKpi = kpis.find((k) => k.id === kpiId);
                if (targetKpi) {
                  setSelectedPositionId(targetKpi.positionId);
                }
                setActiveView('controlgraph');
              }}
            />
          )}
          {activeView === 'checksheet' && <DailyRoutineChecksheet />}
          {activeView === 'googledrive' && <GoogleDriveView />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 lg:px-8 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Kauvery Hospital</span>
              <span aria-hidden="true">·</span>
              <span>Billing Department Daily Work Management System</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Supabase PostgreSQL Connected
              </button>
              <span aria-hidden="true">·</span>
              <span>NABH &amp; JCI Quality Compliance</span>
              <span aria-hidden="true">·</span>
              <span>Daily Routine Management Standards</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal for recording control graph data */}
      <LogDataModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />

      {/* Modal for checking Supabase connection & schema */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Toast notification for dynamic sync */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <DwmProvider>
      <MainLayout />
    </DwmProvider>
  );
}
