import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

// Static template configurations
const templates = [
  {
    id: "type3",
    name: "By Rail Invoice",
    description: "Used for railway transport billing",
    icon: "🚆",
  },
  {
    id: "type2",
    name: "By Road Invoice",
    description: "Used for road logistics billing",
    icon: "🚚",
  },
  {
    id: "type1",
    name: "Special Messenger",
    description: "Used for urgent/special delivery",
    icon: "📦",
  },
];

const BeautifulList = () => {
  // Data structure: { categoryName: [ { _id, text, tType }, ... ] }
  const [items, setItems] = useState({});
  
  // States tracking current editing session
  const [editingId, setEditingId] = useState(null); 
  const [editText, setEditText] = useState("");
  const [editTType, setEditTType] = useState(""); // Captures dropdown updates

  // Transaction state log mapped cleanly by database Object IDs
  const [changeLog, setChangeLog] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/get-saved")
      .then((res) => res.json())
      .then((data) => {
        const accumulatedItems = {};
        
        data.forEach((oj) => {
          if (!accumulatedItems[oj.type]) {
            accumulatedItems[oj.type] = [];
          }
          accumulatedItems[oj.type].push({
            _id: oj._id, 
            text: oj.text,
            tType: oj.tType || "" // Gracefully fallback if property isn't present
          });
        });

        setItems(accumulatedItems);
        setChangeLog({});
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  // --- 1. DELETE HANDLER ---
  const handleDelete = (category, itemToDelete) => {
    const targetId = itemToDelete._id;

    setChangeLog((prev) => {
      const updatedLog = { ...prev };
      const originalText = updatedLog[targetId]?.oldText || itemToDelete.text;
      const originalTType = updatedLog[targetId]?.oldTType !== undefined ? updatedLog[targetId].oldTType : itemToDelete.tType;

      updatedLog[targetId] = {
        _id: targetId,
        action: "delete",
        type: category,
        text: originalText,
        tType: originalTType
      };
      return updatedLog;
    });

    const updatedList = items[category].filter((item) => item._id !== targetId);
    const updatedItems = { ...items };
    if (updatedList.length === 0) {
      delete updatedItems[category];
    } else {
      updatedItems[category] = updatedList;
    }
    setItems(updatedItems);
  };

  // --- 2. EDIT HANDLER (WITH MULTI-PROP LOG TRACKING) ---
  const handleSaveEdit = (category, itemToEdit) => {
    if (!editText.trim()) return;
    const targetId = itemToEdit._id;

    // Check if anything actually changed globally
    if (itemToEdit.text === editText && itemToEdit.tType === editTType) {
      setEditingId(null);
      return;
    }

    setChangeLog((prev) => {
      const updatedLog = { ...prev };
      
      // Keep track of the actual database baseline values across multiple saves
      const baseDbText = updatedLog[targetId]?.oldText || itemToEdit.text;
      const baseDbTType = updatedLog[targetId]?.hasOwnProperty('oldTType') 
        ? updatedLog[targetId].oldTType 
        : itemToEdit.tType;

      // If text and dropdown match original values, drop the transaction record
      if (baseDbText === editText && baseDbTType === editTType) {
        delete updatedLog[targetId];
      } else {
        updatedLog[targetId] = {
          _id: targetId,
          action: "update",
          type: category,
          oldText: baseDbText,
          newText: editText,
          oldTType: baseDbTType,
          newTType: editTType
        };
      }
      return updatedLog;
    });

    // Mirror updates to state items array view
    const updatedList = items[category].map((item) => 
      item._id === targetId ? { ...item, text: editText, tType: editTType } : item
    );
    setItems({ ...items, [category]: updatedList });
    setEditingId(null);
    setEditText("");
    setEditTType("");
  };

  // --- 3. DEDUPLICATE HANDLERS ---
  const handleDeduplicateCategory = (category) => {
    const originalList = items[category];
    const uniqueList = [];
    const seenTexts = new Set();
    const duplicateItems = [];

    originalList.forEach((item) => {
      if (seenTexts.has(item.text)) {
        duplicateItems.push(item);
      } else {
        seenTexts.add(item.text);
        uniqueList.push(item);
      }
    });

    if (duplicateItems.length > 0) {
      setChangeLog((prev) => {
        const updatedLog = { ...prev };
        duplicateItems.forEach((item) => {
          updatedLog[item._id] = {
            _id: item._id,
            action: "delete",
            type: category,
            text: item.text,
            tType: item.tType
          };
        });
        return updatedLog;
      });
    }
    setItems({ ...items, [category]: uniqueList });
  };

  const handleDeduplicateGlobal = () => {
    const updatedItems = {};

    setChangeLog((prev) => {
      const updatedLog = { ...prev };
      Object.entries(items).forEach(([category, itemList]) => {
        const uniqueList = [];
        const seenTexts = new Set();

        itemList.forEach((item) => {
          if (seenTexts.has(item.text)) {
            updatedLog[item._id] = {
              _id: item._id,
              action: "delete",
              type: category,
              text: item.text,
              tType: item.tType
            };
          } else {
            seenTexts.add(item.text);
            uniqueList.push(item);
          }
        });
        updatedItems[category] = uniqueList;
      });
      return updatedLog;
    });
    setItems(updatedItems);
  };

  // --- 4. API ACTIONS SYNC ---
  const handleSaveAllToServer = async () => {
    const cleanPayload = Object.values(changeLog);
    if (cleanPayload.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/sync-changes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes: cleanPayload }),
      });

      if (!response.ok) throw new Error("Sync failure");

      setChangeLog({});
      toast.success("Changes synchronized successfully! 🎉");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to sync your changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // Inline configuration helper function to fetch metadata for a specific template
  const getTemplateMeta = (tTypeId) => {
    return templates.find((t) => t.id === tTypeId) || { name: "Unassigned Template", icon: "📄" };
  };

  const totalPendingChanges = Object.keys(changeLog).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-10 text-white">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Data</h1>
          <p className="text-sm mt-1">
            {totalPendingChanges > 0 ? (
              <span className="text-amber-400">⚠️ {totalPendingChanges} structural ID updates tracked</span>
            ) : (
              <span className="text-emerald-400">🟢 No unsaved changes</span>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {Object.keys(items).length > 0 && (
            <button
              onClick={handleDeduplicateGlobal}
              className="bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-sm px-4 py-2 rounded-xl border border-white/10 transition cursor-pointer"
            >
              ✨ Clean All Duplicates
            </button>
          )}

          <button
            onClick={handleSaveAllToServer}
            disabled={totalPendingChanges === 0 || isSaving}
            className={`font-medium text-sm px-5 py-2 rounded-xl transition shadow-lg flex items-center gap-2 ${
              totalPendingChanges > 0
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer"
                : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : `💾 Sync Changes (${totalPendingChanges})`}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(items).map(([category, itemList]) => (
          <div
            key={category}
            className="p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl flex flex-col justify-between animate-fadeIn"
          >
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h2 className="text-xl font-semibold text-indigo-400">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <button
                  onClick={() => handleDeduplicateCategory(category)}
                  className="text-xs text-gray-400 hover:text-indigo-300 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition cursor-pointer"
                >
                  Clear Dupes
                </button>
              </div>
              
              <ul className="space-y-4">
                {itemList.map((item) => {
                  const isEditing = editingId === item._id;
                  const currentMeta = getTemplateMeta(item.tType);

                  return (
                    <li 
                      key={item._id}
                      className="flex flex-col gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group relative"
                    >
                      {isEditing ? (
                        /* --- EDITING MODE: INLINE CONTROLS --- */
                        <div className="flex flex-col gap-3 w-full">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Text Content</label>
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="bg-gray-800 text-white px-2 py-1.5 rounded-lg border border-white/10 text-sm focus:border-indigo-500 focus:outline-none w-full"
                              autoFocus
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Invoice Template (tType)</label>
                            <select
                              value={editTType}
                              onChange={(e) => setEditTType(e.target.value)}
                              className="bg-gray-800 text-white px-2 py-1.5 rounded-lg border border-white/10 text-sm focus:border-indigo-500 focus:outline-none w-full cursor-pointer"
                            >
                              <option value="">-- No Template Assigned --</option>
                              {templates.map((tmpl) => (
                                <option key={tmpl.id} value={tmpl.id}>
                                  {tmpl.icon} {tmpl.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => handleSaveEdit(category, item)}
                              className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* --- DISPLAY MODE --- */
                        <>
                          {/* Top Row: Data text string */}
                          <div className="pr-16">
                            <span className="text-gray-100 font-medium block text-sm break-all leading-snug">
                              {item.text}
                            </span>
                          </div>

                          {/* Expanded Vertical Space: Configurable template metadata badge */}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm shrink-0" role="img" aria-label="Template Icon">
                              {currentMeta.icon}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium border tracking-wide ${
                              item.tType 
                                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" 
                                : "bg-gray-500/10 border-gray-500/20 text-gray-400 italic"
                            }`}>
                              {currentMeta.name}
                            </span>
                          </div>
                          
                          {/* Contextual Floating Actions Row */}
                          <div className="absolute top-3 right-3 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                            <button
                              onClick={() => {
                                setEditingId(item._id);
                                setEditText(item.text);
                                setEditTType(item.tType);
                              }}
                              className="p-1 px-2 text-xs rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 transition cursor-pointer"
                              title="Edit Row Data"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(category, item)}
                              className="p-1 px-2 text-xs rounded-md bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 transition cursor-pointer"
                              title="Delete Document"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default BeautifulList;