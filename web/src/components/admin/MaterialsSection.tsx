import { Material } from "@/types/material";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, Edit, Trash2, AlertTriangle, Loader2, ChevronRight, FileText } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const MaterialsSection: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    
    fetch(`${baseUrl}/materials/?page=${page}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load materials: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.materials)) {
          setMaterials(prev => page === 1 ? data.materials : [...prev, ...data.materials]);
          setHasMore(data.materials.length > 0);
        } else {
          setHasMore(false);
        }
      })
      .catch(err => {
        setError(err.message || "Failed to load materials");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handleMore = () => {
    if (!loading && hasMore) setPage(p => p + 1);
  };

  const handleDelete = async (id: string) => {
    setDeleteError("");
    setDeleteLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/materials/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete material");
      }
      setMaterials(prev => prev.filter(m => m.id !== id));
      setShowDeleteDialog(null);
      setDeleteInput("");
    } catch (err) {
      setDeleteError("Error deleting material" + err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <motion.section
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <FileImage className="w-5 h-5 text-pink-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Materials</h3>
          <span className="ml-3 px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
            {materials.length}
          </span>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {materials.length > 0 ? (
            materials.map((material, index) => (
              <motion.div
                key={material.id}
                className="group bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <FileText className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="font-medium text-gray-900 group-hover:text-pink-700 transition-colors duration-300 truncate">
                      {material.title || material.file || 'Material'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { 
                        setShowDeleteDialog(material.id); 
                        setDeleteInput(""); 
                        setDeleteError(""); 
                      }}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : loading ? (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-pink-600 mr-3" />
              <span className="text-gray-600">Loading materials...</span>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <FileImage className="w-6 h-6 text-gray-400 mr-3" />
              <span className="text-gray-500">No materials yet</span>
            </motion.div>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {/* More Button */}
        <motion.button
          className={`w-full px-4 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
            hasMore && !loading
              ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleMore}
          disabled={!hasMore || loading}
          whileHover={{ scale: hasMore && !loading ? 1.02 : 1, y: hasMore && !loading ? -1 : 0 }}
          whileTap={{ scale: hasMore && !loading ? 0.98 : 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : hasMore ? (
            <>
              <span>Load More Materials</span>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          ) : (
            'No more materials'
          )}
        </motion.button>
      </motion.section>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Material</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Type <span className="font-semibold text-red-600">&quot;delete material&quot;</span> to confirm deletion.
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Type here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300"
                  disabled={deleteLoading}
                />
                {deleteError && (
                  <motion.div
                    className="mt-2 text-sm text-red-600 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {deleteError}
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => { 
                    setShowDeleteDialog(null); 
                    setDeleteInput(""); 
                    setDeleteError(""); 
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (deleteInput.trim().toLowerCase() === "delete material") {
                      handleDelete(showDeleteDialog);
                    } else {
                      setDeleteError("You must type 'delete material' to confirm.");
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={deleteLoading}
                  whileHover={{ scale: deleteLoading ? 1 : 1.02 }}
                  whileTap={{ scale: deleteLoading ? 1 : 0.98 }}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MaterialsSection;
