import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Invoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [deletingId, setDeletingId] = useState(null);

  // --- INLINE NAME EDITING STATES ---
  const [editingNameId, setEditingNameId] = useState(null); 
  const [tempNameText, setTempNameText] = useState("");     
  const [isUpdatingName, setIsUpdatingName] = useState(false); // Spinner state for individual saves

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

  // --- 1. SIMPLE, IMMEDIATE DIRECT SAVE HANDLER ---
  const handleSaveName = async (invoice) => {
    const cleanName = tempNameText.trim();

    // Guard: If unchanged, just close fields to save network bandwidth
    if (invoice.name === cleanName) {
      setEditingNameId(null);
      return;
    }

    setIsUpdatingName(true);

    try {
      // Direct individual POST mapping straight to your exact Next.js API endpoint schema
      const response = await fetch('/api/add-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invoice._id,
          name: cleanName,
          bill: invoice.bill,
          voiceData: invoice.voiceData,
          type: invoice.type,
          words: invoice.words
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status returned: ${response.status}`);
      }

      // Update local view state instantly on successful database confirmation
      setInvoices((prev) => prev.map(inv => 
        inv._id === invoice._id ? { ...inv, name: cleanName } : inv
      ));

      toast.success("Invoice name updated in Database! 🎉");
      setEditingNameId(null);
    } catch (err) {
      console.error("Direct save crash:", err);
      toast.error(`Failed to save name: ${err.message}`);
    } finally {
      setIsUpdatingName(false);
    }
  };

  // --- 2. COMPREHENSIVE DELETE HANDLER ---
  const handleDeleteInvoice = async (e, invoiceId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to permanently delete this invoice?")) {
      return;
    }

    setDeletingId(invoiceId);

    try {
      const response = await fetch(`/api/delete-invoice?id=${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      setInvoices((prevInvoices) => prevInvoices.filter(inv => inv._id !== invoiceId));
      toast.success("Invoice successfully purged.");
    } catch (err) {
      console.error("Deletion error:", err);
      alert(`Failed to delete invoice: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

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

        {/* Loading & Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm font-medium text-slate-500">Fetching live data matrix...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            <p className="font-semibold">⚠️ Execution Stopped: {error}</p>
          </div>
        )}

        {/* Invoices Rendering Layout */}
        {!loading && !error && (
          <>
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-25 text-center bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                <p className="text-base font-semibold text-slate-900">No data models compiled</p>
              </div>
            ) : (
              <div className="space-y-8">
                {invoices.map((invoice) => {
                  const isEditingName = editingNameId === invoice._id;

                  return (
                    <div 
                      key={invoice._id} 
                      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer relative"
                      onClick={() => router.push("/table?type="+invoice.type+"&id="+invoice._id)}
                    >
                      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                      
                      <div className="p-6">
                        {/* --- TOP ROW ALIAS NAME INTERACTION CONTAINER --- */}
                        <div className="w-full mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-center justify-center gap-4" onClick={(e) => e.stopPropagation()}>
                          {isEditingName ? (
                            <div className="flex items-center gap-2 w-full max-w-md">
                              <input 
                                type="text"
                                value={tempNameText}
                                onChange={(e) => setTempNameText(e.target.value)}
                                className="bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:border-blue-500 focus:outline-none w-full font-medium"
                                placeholder="Enter document alias label name..."
                                disabled={isUpdatingName}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSaveName(invoice)}
                                disabled={isUpdatingName}
                                className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md hover:bg-blue-500 disabled:opacity-50 transition cursor-pointer shrink-0"
                              >
                                {isUpdatingName ? 'Saving...' : 'Save'}
                              </button>
                              <button 
                                onClick={() => setEditingNameId(null)}
                                disabled={isUpdatingName}
                                className="bg-slate-200 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md hover:bg-slate-300 disabled:opacity-50 transition cursor-pointer shrink-0"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 truncate justify-center w-full">
                              <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider"></span>
                              <span className={`font-semibold truncate text-xl ${invoice.name ? 'text-blue-600' : 'text-slate-400 italic'}`}>
                                {invoice.name || "No label name assigned"}
                              </span>
                              <button 
                                onClick={() => setEditingNameId(invoice._id) || setTempNameText(invoice.name || "")}
                                className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded hover:bg-blue-100 hover:text-blue-700 font-medium transition cursor-pointer"
                              >
                                ✏️ Rename
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Card Header Content */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                          <div>
                            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Billing Date</span>
                            <h3 className="text-xl font-bold text-slate-800">{invoice.bill?.date || 'N/A'}</h3>
                          </div>
                          
                          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                              invoice.bill?.igst 
                                ? 'bg-purple-50 text-purple-700 ring-purple-600/10' 
                                : 'bg-blue-50 text-blue-700 ring-blue-600/10'
                            }`}>
                              {invoice.bill?.igst ? 'Integrated (IGST)' : 'Standard GST'}
                            </span>

                            <button
                              onClick={(e) => handleDeleteInvoice(e, invoice._id)}
                              disabled={deletingId === invoice._id}
                              className="p-1.5 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 bg-red-50/50 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shrink-0 cursor-pointer"
                            >
                              {deletingId === invoice._id ? 'Processing...' : '🗑️ Delete Card'}
                            </button>
                          </div>
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

                        {/* Consignments Table Breakdown */}
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
                              <p className="text-xs italic text-slate-400">No manifest entries exist.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
    </div>
  );
}