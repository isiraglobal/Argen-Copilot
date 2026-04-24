import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

export default function APIAccess() {
  const { user } = useUser();
  const [apiKeys, setApiKeys] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load API keys
    setLoading(false);
  }, []);

  const handleCreateKey = async () => {
    if (!keyName.trim()) return;
    // TODO: Call API to create key
    setShowCreateModal(false);
    setKeyName('');
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold font-mono text-dark">API Access</h1>
            <p className="text-dark mt-2">Manage your API keys</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="retro-btn-primary px-6 py-3 font-bold"
          >
            + Create Key
          </button>
        </div>

        {/* API Docs Quick Start */}
        <div className="border-4 border-dark p-8 retro-box mb-8">
          <h2 className="text-2xl font-bold text-dark mb-4">Quick Start</h2>
          <pre className="bg-dark p-4 text-cream font-mono text-sm overflow-x-auto mb-4">
{`import fetch from 'node-fetch';

const response = await fetch('https://api.argen.dev/api/challenges', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
console.log(data);`}
          </pre>
          <a
            href="#"
            className="text-green-dark underline font-mono font-bold"
          >
            View Full Documentation →
          </a>
        </div>

        {/* API Keys List */}
        <div className="border-4 border-dark p-8 retro-box">
          <h2 className="text-2xl font-bold text-dark mb-6">Your API Keys</h2>

          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-dark/70 mb-4">No API keys yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="retro-btn-primary px-6 py-3 font-bold"
              >
                Create Your First Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="border-3 border-dark p-4 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-dark">{key.name}</p>
                    <p className="text-sm text-dark/70 font-mono">{key.keyPrefix}****</p>
                    <p className="text-xs text-dark/50 mt-2">
                      Created: {new Date(key.created_at).toLocaleDateString()}
                    </p>
                    {key.last_used && (
                      <p className="text-xs text-dark/50">
                        Last used: {new Date(key.last_used).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button className="px-4 py-2 border-2 border-red-600 text-red-600 font-mono font-bold hover:bg-red-600/10">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-cream border-4 border-dark p-8 retro-box max-w-md w-full">
              <h2 className="text-2xl font-bold text-dark mb-6">Create API Key</h2>
              <input
                type="text"
                placeholder="Key Name (e.g., Production)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full mb-6 p-3 border-3 border-dark font-mono"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleCreateKey}
                  className="flex-1 retro-btn-primary py-2 font-bold"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 retro-btn py-2 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
