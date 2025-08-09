import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Edit, Trash2, AlertTriangle, Loader2, Info, ChevronRight } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const SchoolsSection: React.FC = () => {
  const [schools, setSchools] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  
  const handleDelete = async (id: string) => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/schools/" + id, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete school");
      }
      setSchools(prev => prev.filter(s => s.id !== id));
      setShowDeleteDialog(null);
      setDeleteInput("");
    } catch (err) {
      setDeleteError("Error deleting school" + err);
    } finally {
      setDeleteLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetch(baseUrl + "/schools/all?page=1")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch schools");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.schools)) {
          setSchools(data.schools);
        } else {
          setError("Invalid schools data");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error fetching schools");
        setLoading(false);
      });
  }, []);

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
          <GraduationCap className="w-5 h-5 text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Schools</h3>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            {schools.length}
          </span>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-3" />
            <span className="text-gray-600">Loading schools...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <span className="text-red-500">{error}</span>
          </motion.div>
        ) : schools.length === 0 ? (
          <motion.div
            className="flex items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GraduationCap className="w-6 h-6 text-gray-400 mr-3" />
            <span className="text-gray-500">No schools found</span>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {schools.slice(0, 4).map((school, index) => (
              <motion.div
                key={school.id}
                className="group bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      {school.name}
                    </h4>
                    {school.description && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Info className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{school.description}</span>
                      </div>
                    )}
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
                        setShowDeleteDialog(school.id); 
                        setDeleteInput(""); 
                        setDeleteError(""); 
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* More Button */}
        <motion.button
          className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span>View All Schools</span>
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
                  <h3 className="text-lg font-bold text-gray-900">Delete School</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Type <span className="font-semibold text-red-600">"delete school"</span> to confirm deletion.
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
                    if (deleteInput.trim().toLowerCase() === "delete school") {
                      handleDelete(showDeleteDialog);
                    } else {
                      setDeleteError("You must type 'delete school' to confirm.");
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

export default SchoolsSection;
