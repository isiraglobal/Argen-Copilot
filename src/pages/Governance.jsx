import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

interface GovernanceSettings {
  autoModerationEnabled: boolean;
  contentFilterLevel: string;
  plagiarismCheckEnabled: boolean;
  dailyLimit: number;
  monthlyLimit: number;
}

interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  timestamp: string;
  user: string;
  details: string;
}

export default function Governance() {
  const { user } = useUser();
  const [settings, setSettings] = useState<GovernanceSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'audit' | 'compliance'>('settings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'settings') {
        const data = await fetchApi('/api/governance/settings');
        setSettings(data);
      } else if (activeTab === 'audit') {
        const data = await fetchApi('/api/governance/audit-log');
        setAuditLogs(data?.audit_logs || []);
      }
    } catch (error) {
      console.error('Failed to load governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">AI Governance</h1>
          <p className="text-dark">Manage policies and compliance</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-12 border-b-4 border-dark">
          {(['settings', 'audit', 'compliance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 border-4 border-dark border-b-0 font-mono font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-green-dark text-cream'
                  : 'bg-cream text-dark hover:bg-dark/5'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-8">Governance Settings</h2>

            <div className="space-y-8">
              {/* Auto-Moderation */}
              <div className="flex items-center justify-between p-6 border-3 border-dark">
                <div>
                  <h3 className="font-bold text-dark">Auto-Moderation</h3>
                  <p className="text-sm text-dark/70">Automatically flag suspicious submissions</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoModerationEnabled}
                  className="w-6 h-6"
                  readOnly
                />
              </div>

              {/* Content Filter Level */}
              <div className="p-6 border-3 border-dark">
                <h3 className="font-bold text-dark mb-4">Content Filter Level</h3>
                <div className="flex gap-4">
                  {['low', 'medium', 'high'].map((level) => (
                    <label key={level} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filter"
                        value={level}
                        checked={settings.contentFilterLevel === level}
                        readOnly
                      />
                      <span className="font-mono text-dark">{level.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plagiarism Check */}
              <div className="flex items-center justify-between p-6 border-3 border-dark">
                <div>
                  <h3 className="font-bold text-dark">Plagiarism Detection</h3>
                  <p className="text-sm text-dark/70">Check submissions against known content</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.plagiarismCheckEnabled}
                  className="w-6 h-6"
                  readOnly
                />
              </div>

              {/* API Limits */}
              <div className="p-6 border-3 border-dark">
                <h3 className="font-bold text-dark mb-4">Usage Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark/70 mb-2">DAILY LIMIT</label>
                    <input
                      type="number"
                      value={settings.dailyLimit}
                      className="w-full p-3 border-3 border-dark font-mono"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-dark/70 mb-2">MONTHLY LIMIT</label>
                    <input
                      type="number"
                      value={settings.monthlyLimit}
                      className="w-full p-3 border-3 border-dark font-mono"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-8">Audit Log</h2>

            {auditLogs.length === 0 ? (
              <p className="text-center text-dark/70 py-8">No audit logs available</p>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border-3 border-dark p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-dark">{log.action}</h3>
                      <span className="text-sm text-dark/70">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-dark mb-2">{log.details}</p>
                    <div className="flex gap-4 text-xs text-dark/70">
                      <span>User: {log.user}</span>
                      <span>Resource: {log.resourceType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="border-4 border-dark p-8 retro-box">
            <h2 className="text-2xl font-bold text-dark mb-8">Compliance Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border-3 border-dark">
                <div className="text-3xl font-bold text-green-dark">0</div>
                <p className="text-dark text-sm mt-2">Violations This Month</p>
              </div>
              <div className="text-center p-6 border-3 border-dark">
                <div className="text-3xl font-bold text-green-dark">100%</div>
                <p className="text-dark text-sm mt-2">Compliance Score</p>
              </div>
              <div className="text-center p-6 border-3 border-dark">
                <div className="text-3xl font-bold text-green-dark">0</div>
                <p className="text-dark text-sm mt-2">Actions Required</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
