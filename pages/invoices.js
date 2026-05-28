import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function Invoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const response = await fetch('/api/get-voice');
        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        setError(err.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased selection:bg-blue-500 selection:text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Monitor your GST details and nested consignment data instantly.</p>
          </div>
          <div className="inline-flex items-center gap-x-2 bg-white border border-slate-200 rounded-full py-1.5 px-4 text-xs font-medium text-slate-700 shadow-sm self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Total Shipments: <span className="font-bold text-slate-900">{invoices.length}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm font-medium text-slate-500">Fetching live matrix data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="font-semibold">Execution Stopped:</p>
            </div>
            <p className="mt-1 ml-6 text-red-700">{error}</p>
          </div>
        )}

        {/* Invoices Layout */}
        {!loading && !error && (
          <>
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-25 text-center bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                <p className="text-base font-semibold text-slate-900">No data models compiled</p>
                <p className="mt-1 text-sm text-slate-400">Database collection appears empty.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice._id} 
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                    onClick={() => router.push("/table?type="+invoice.type+"&id="+invoice._id)}
                  >
                    {/* Top Accent Strip */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Billing Date</span>
                          <h3 className="text-xl font-bold text-slate-800">{invoice.bill?.date || 'N/A'}</h3>
                        </div>
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          invoice.bill?.igst 
                            ? 'bg-purple-50 text-purple-700 ring-purple-600/10' 
                            : 'bg-blue-50 text-blue-700 ring-blue-600/10'
                        }`}>
                          {invoice.bill?.igst ? 'Integrated (IGST)' : 'Standard GST'}
                        </span>
                      </div>

                      {/* Metadata Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GSTIN Identifier</span>
                          <span className="text-sm font-mono font-medium text-slate-700">{invoice.bill?.gst || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bill Reference Code</span>
                          <span className="text-sm font-medium text-slate-700">{invoice.bill?.code || '—'}</span>
                        </div>
                      </div>

                      {/* Shipments Breakdown */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                          📁 Operational Consignments 
                          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {invoice.voiceData?.length || 0}
                          </span>
                        </h4>

                        {invoice.voiceData && invoice.voiceData.length > 0 ? (
                          <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner">
                            <table className="w-full text-left text-sm border-collapse">
                              <thead>
                                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold">
                                  <th className="px-4 py-3 text-xs uppercase tracking-wider">Sr.</th>
                                  <th className="px-4 py-3 text-xs uppercase tracking-wider">Inv No.</th>
                                  <th className="px-4 py-3 text-xs uppercase tracking-wider">Transit Details</th>
                                  <th className="px-4 py-3 text-xs uppercase tracking-wider">Counterparties</th>
                                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-right">Aggregate</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {invoice.voiceData.map((item, idx) => (
                                  <tr key={item._id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3.5 font-medium text-slate-400">{item.sr_no || idx + 1}</td>
                                    <td className="px-4 py-3.5">
                                      <span className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs font-mono font-medium text-slate-600">
                                        {item.invoice_no || '—'}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                      <div className="flex items-center gap-1.5 font-medium text-slate-700 text-xs">
                                        <span className="text-slate-900 font-semibold">{item.from || 'Origin'}</span>
                                        <span className="text-blue-500 font-bold">→</span>
                                        <span className="text-slate-900 font-semibold">{item.destination || 'Dest'}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs text-slate-500 leading-relaxed">
                                      <div><span className="font-medium text-slate-400">Shipper:</span> {item.sender || '—'}</div>
                                      <div><span className="font-medium text-slate-400">Receiver:</span> {item.receiver || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                                      ₹{parseFloat(item.total_amount || 0).toLocaleString('en-IN')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <p className="text-xs italic text-slate-400">No independent manifest fields exist on this entry.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}