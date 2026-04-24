import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { fetchApi } from '../lib/api';

export default function AuditLog() {
  const { user } = useUser();
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/api/governance/audit-log?page=${page}&limit=20`);
      setLogs(data?.audit_logs || []);
      setTotalPages(Math.ceil((data?.total || 0) / 20));
    } catch (error) {
      console.error('Failed to load audit logs:', error);
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
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Audit Log</h1>
          <p className="text-dark">View all account activities and changes</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 flex gap-4 flex-wrap">
          <button className="px-6 py-3 border-3 border-dark font-mono font-bold bg-green-dark text-cream">
            All Actions
          </button>
          <button className="px-6 py-3 border-3 border-dark font-mono font-bold retro-btn">
            Submissions
          </button>
          <button className="px-6 py-3 border-3 border-dark font-mono font-bold retro-btn">
            Settings
          </button>
          <button className="px-6 py-3 border-3 border-dark font-mono font-bold retro-btn">
            Security
          </button>
        </div>

        {/* Audit Log Table */}
        {logs.length === 0 ? (
          <div className="text-center py-16 retro-box p-8">
            <p className="text-dark text-lg">No audit logs available</p>
          </div>
        ) : (
          <div className="border-4 border-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-3 border-dark bg-green-dark text-cream">
                    <th className="p-4 text-left font-bold border-r-3 border-dark">Timestamp</th>
                    <th className="p-4 text-left font-bold border-r-3 border-dark">Action</th>
                    <th className="p-4 text-left font-bold border-r-3 border-dark">Resource</th>
                    <th className="p-4 text-left font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b-3 border-dark hover:bg-cream/50">
                      <td className="p-4 font-mono text-sm border-r-3 border-dark">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold border-r-3 border-dark">
                        <span className="px-3 py-1 border-2 border-dark bg-cream">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm border-r-3 border-dark">
                        {log.resourceType}
                      </td>
                      <td className="p-4 text-sm">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-6 py-3 border-3 border-dark font-mono font-bold retro-btn disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="px-6 py-3 font-mono font-bold text-dark">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 border-3 border-dark font-mono font-bold retro-btn disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
