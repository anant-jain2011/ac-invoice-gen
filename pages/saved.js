import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const templates = [
  { id: "", name: "All Templates", description: "Includes all invoice types", icon: "📁" },
  { id: "type3", name: "By Rail Invoice", description: "Used for railway transport billing", icon: "🚆" },
  { id: "type2", name: "By Road Invoice", description: "Used for road logistics billing", icon: "🚚" },
  { id: "type1", name: "Special Messenger", description: "Used for urgent/special delivery", icon: "📦" },
];

const BeautifulList = () => {
  const [items, setItems] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTType, setEditTType] = useState("");

  // Inline creation states
  const [activeAddCategory, setActiveAddCategory] = useState(null);
  const [newText, setNewText] = useState("");
  const [newTType, setNewTType] = useState("");

  // Track changes. New items use a composite key (`create-${category}-${index}`) in the log object
  const [changeLog, setChangeLog] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Reusable fetch to load or refresh data cleanly from the DB
  const fetchItems = () => {
    fetch("/api/get-saved")
      .then((res) => res.json())
      .then((data) => {
        const accumulatedItems = {};
        data.forEach((oj) => {
          if (!accumulatedItems[oj.type]) accumulatedItems[oj.type] = [];
          accumulatedItems[oj.type].push({
            _id: oj._id,
            text: oj.text,
            tType: oj.tType || ""
          });
        });
        setItems(accumulatedItems);
        setChangeLog({});
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- 1. CLEAN CREATE HANDLER (NO _id ASSIGNED) ---
  const handleAddItem = (category) => {
    if (!newText.trim()) {
      toast.error("Item text cannot be empty.");
      return;
    }

    const newDocument = {
      text: newText.trim(),
      tType: newTType
    };

    const currentCategoryList = items[category] || [];
    const tempIndex = currentCategoryList.length;
    const logKey = `create-${category}-${tempIndex}`;

    // Queue the creation without forcing a fake _id
    setChangeLog((prev) => ({
      ...prev,
      [logKey]: {
        action: "create",
        type: category,
        text: newDocument.text,
        tType: newDocument.tType
      }
    }));

    // Optimistically update the local view layout
    setItems((prev) => ({
      ...prev,
      [category]: [...currentCategoryList, newDocument]
    }));

    setNewText("");
    setNewTType("");
    setActiveAddCategory(null);
    toast.info("Added pending item creation");
  };

  // --- 2. CLEAN DELETE HANDLER ---
  const handleDelete = (category, itemToDelete, index) => {
    const targetId = itemToDelete._id;

    setChangeLog((prev) => {
      const updatedLog = { ...prev };

      if (!targetId) {
        // If it doesn't have an _id, it's a pending client creation. Drop it from the log.
        const logKey = `create-${category}-${index}`;
        delete updatedLog[logKey];
      } else {
        const originalText = updatedLog[targetId]?.oldText || itemToDelete.text;
        const originalTType = updatedLog[targetId]?.hasOwnProperty('oldTType') ? updatedLog[targetId].oldTType : itemToDelete.tType;

        updatedLog[targetId] = {
          _id: targetId,
          action: "delete",
          type: category,
          text: originalText,
          tType: originalTType
        };
      }
      return updatedLog;
    });

    // Update UI View
    const updatedList = items[category].filter((_, idx) => idx !== index);
    const updatedItems = { ...items };
    if (updatedList.length === 0) {
      delete updatedItems[category];
    } else {
      updatedItems[category] = updatedList;
    }
    setItems(updatedItems);
  };

  // --- 3. CLEAN EDIT HANDLER ---
  const handleSaveEdit = (category, itemToEdit, index) => {
    if (!editText.trim()) return;
    const targetId = itemToEdit._id;

    if (itemToEdit.text === editText && itemToEdit.tType === editTType) {
      setEditingId(null);
      return;
    }

    setChangeLog((prev) => {
      const updatedLog = { ...prev };

      if (!targetId) {
        // Modifying a pending local creation row directly inside the log
        const logKey = `create-${category}-${index}`;
        updatedLog[logKey] = {
          ...updatedLog[logKey],
          text: editText.trim(),
          tType: editTType
        };
      } else {
        const baseDbText = updatedLog[targetId]?.oldText || itemToEdit.text;
        const baseDbTType = updatedLog[targetId]?.hasOwnProperty('oldTType') ? updatedLog[targetId].oldTType : itemToEdit.tType;

        if (baseDbText === editText && baseDbTType === editTType) {
          delete updatedLog[targetId];
        } else {
          updatedLog[targetId] = {
            _id: targetId,
            action: "update",
            type: category,
            oldText: baseDbText,
            newText: editText.trim(),
            oldTType: baseDbTType,
            newTType: editTType
          };
        }
      }
      return updatedLog;
    });

    const updatedList = items[category].map((item, idx) =>
      idx === index ? { ...item, text: editText.trim(), tType: editTType } : item
    );
    setItems({ ...items, [category]: updatedList });
    setEditingId(null);
    setEditText("");
    setEditTType("");
  };

  // --- 4. CLEAN DEDUPLICATE HANDLERS ---
  const handleDeduplicateCategory = (category) => {
    const originalList = items[category] || [];
    const uniqueList = [];
    const seenTexts = new Set();
    const updatedLog = { ...changeLog };

    originalList.forEach((item, idx) => {
      if (seenTexts.has(item.text)) {
        if (!item._id) {
          delete updatedLog[`create-${category}-${idx}`];
        } else {
          updatedLog[item._id] = {
            _id: item._id,
            action: "delete",
            type: category,
            text: item.text,
            tType: item.tType
          };
        }
      } else {
        seenTexts.add(item.text);
        uniqueList.push(item);
      }
    });
    setChangeLog(updatedLog);

    setItems({ ...items, [category]: uniqueList });
  };

  const handleDeduplicateGlobal = () => {
    const updatedItems = {};

    setChangeLog((prev) => {
      const updatedLog = { ...prev };
      Object.entries(items).forEach(([category, itemList]) => {
        const uniqueList = [];
        const seenTexts = new Set();

        itemList.forEach((item, idx) => {
          if (seenTexts.has(item.text)) {
            if (!item._id) {
              delete updatedLog[`create-${category}-${idx}`];
            } else {
              updatedLog[item._id] = {
                _id: item._id,
                action: "delete",
                type: category,
                text: item.text,
                tType: item.tType
              };
            }
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

  // --- 5. CLEAN NETWORK SYNC & REFRESH ---
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

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Sync failure");

      // Pull fresh data from the server so MongoDB-allocated _ids are instantly applied
      fetchItems();
      toast.success("All updates synced to database successfully! 🎉");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(`Sync Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getTemplateMeta = (tTypeId) => {
    return templates.find((t) => t.id === tTypeId) || { name: "Unassigned Template", icon: "📄" };
  };

  const newLocal = "➕ Add";
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-10 text-white">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Data</h1>
          <p className="text-sm mt-1">
            {Object.keys(changeLog).length > 0 ? (
              <span className="text-amber-400">⚠️ {Object.keys(changeLog).length} pending operational items tracked</span>
            ) : (
              <span className="text-emerald-400">🟢 All changes synchronized</span>
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
            disabled={Object.keys(changeLog).length === 0 || isSaving}
            className={`font-medium text-sm px-5 py-2 rounded-xl transition shadow-lg flex items-center gap-2 ${Object.keys(changeLog).length > 0
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer"
              : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
              }`}
          >
            {isSaving ? "Saving..." : `💾 Sync Changes (${Object.keys(changeLog).length})`}
          </button>
        </div>
      </div>

      {/* Categories Grid Container */}
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveAddCategory(activeAddCategory === category ? null : category)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-md transition cursor-pointer font-medium"
                  >
                    {activeAddCategory === category ? "Collapse" : newLocal}
                  </button>
                  <button
                    onClick={() => handleDeduplicateCategory(category)}
                    className="text-xs text-gray-400 hover:text-indigo-300 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition cursor-pointer"
                  >
                    Clear Duplicates
                  </button>
                </div>
              </div>

              <ul className="space-y-4">
                {/* INLINE ROW ACCUMULATION FORM */}
                {activeAddCategory === category && (
                  <li className="flex flex-col gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 animate-fadeIn">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">New Content Text</label>
                      <input
                        type="text"
                        placeholder="Type text value..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="bg-gray-800/80 text-white placeholder-gray-500 px-2 py-1.5 rounded-lg border border-emerald-500/30 text-sm focus:border-emerald-500 focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Select Template Type</label>
                      <select
                        value={newTType}
                        onChange={(e) => setNewTType(e.target.value)}
                        className="bg-gray-800/80 text-white px-2 py-1.5 rounded-lg border border-emerald-500/30 text-sm focus:border-emerald-500 focus:outline-none w-full cursor-pointer"
                      >
                        {templates.map((tmpl) => (
                          <option key={tmpl.id} value={tmpl.id}>{tmpl.icon} {tmpl.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => handleAddItem(category)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                      >
                        Insert Row
                      </button>
                    </div>
                  </li>
                )}

                {/* ROW RENDER ENGINE */}
                {itemList.map((item, idx) => {
                  // Fallback to array index identifier uniquely if item hasn't been saved to DB yet
                  const currentElementId = item._id || `temp-row-${idx}`;
                  const isEditing = editingId === currentElementId;
                  const currentMeta = getTemplateMeta(item.tType);

                  return (
                    <li
                      key={currentElementId}
                      className="flex flex-col gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group relative"
                    >
                      {isEditing ? (
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
                              {templates.map((tmpl) => (
                                <option key={tmpl.id} value={tmpl.id}>{tmpl.icon} {tmpl.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => handleSaveEdit(category, item, idx)}
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
                        <>
                          <div className="pr-16">
                            <span className="text-gray-100 font-medium block text-sm break-all leading-snug">{item.text}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm shrink-0" role="img" aria-label="Template Icon">{currentMeta.icon}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium border tracking-wide ${item.tType ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" : "bg-gray-500/10 border-gray-500/20 text-gray-400 italic"
                              }`}>
                              {currentMeta.name}
                            </span>
                            {!item._id && (
                              <span className="text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight animate-pulse">Pending</span>
                            )}
                          </div>
                          <div className="absolute top-3 right-3 flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                            <button
                              onClick={() => {
                                setEditingId(currentElementId);
                                setEditText(item.text);
                                setEditTType(item.tType);
                              }}
                              className="p-1 px-2 text-xs rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 transition cursor-pointer"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(category, item, idx)}
                              className="p-1 px-2 text-xs rounded-md bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 transition cursor-pointer"
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