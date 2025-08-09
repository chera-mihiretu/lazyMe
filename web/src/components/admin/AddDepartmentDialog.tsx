import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, AlertTriangle, Loader2, Plus, ChevronDown } from 'lucide-react';
import { University } from "../signup/useUniversities";
import { School } from "../signup/useSchools";

interface AddDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingUniversities(true);
    fetch(baseUrl + "/universities/")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities.map((u: University) => ({ id: u.id, name: u.name })));
        } else {
        }
        setLoadingUniversities(false);
      })
      .catch(() => {
        setLoadingUniversities(false);
      });
  }, [open]);

  useEffect(() => {
    if (!selectedUniversity) {
      setSchools([]);
      setSelectedSchool("");
      return;
    }
    setLoadingSchools(true);
    fetch(`${baseUrl}/schools/?university_id=${selectedUniversity}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.schools)) {
          setSchools(data.schools.map((s: School) => ({ id: s.id, name: s.name })));
        } else {
        }
        setLoadingSchools(false);
      })
      .catch(() => {
        setLoadingSchools(false);
      });
  }, [selectedUniversity]);

  const handleSubmit = async () => {
    setAddError("");
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/departments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: departmentName,
          description,
          school_id: selectedSchool,
          years: year ? Number(year) : undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add department");
      }
      setDepartmentName("");
      setSelectedUniversity("");
      setSelectedSchool("");
      setDescription("");
      setYear("");
      onClose();
    } catch (err) {
      setAddError("Error adding department" + err);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Add Department</h3>
                  <p className="text-sm text-gray-500">Create a new department</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={addLoading}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University *
                </label>
                <div className="relative">
                  <select
                    value={selectedUniversity}
                    onChange={e => setSelectedUniversity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 appearance-none bg-white pr-10"
                    disabled={addLoading}
                  >
                    <option value="">{loadingUniversities ? "Loading..." : "Select University"}</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <div className="relative">
                  <select
                    value={selectedSchool}
                    onChange={e => setSelectedSchool(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 appearance-none bg-white pr-10"
                    disabled={addLoading || !selectedUniversity}
                  >
                    <option value="">{loadingSchools ? "Loading..." : "Select School"}</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  placeholder="Enter department name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                  disabled={addLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter department description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                  disabled={addLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Year (Optional)
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="Enter department year"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
                  disabled={addLoading}
                />
              </div>

              {/* Error Message */}
              {addError && (
                <motion.div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{addError}</span>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={addLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!selectedUniversity || !selectedSchool || !departmentName.trim() || addLoading}
                whileHover={{ scale: (!selectedUniversity || !selectedSchool || !departmentName.trim() || addLoading) ? 1 : 1.02 }}
                whileTap={{ scale: (!selectedUniversity || !selectedSchool || !departmentName.trim() || addLoading) ? 1 : 0.98 }}
              >
                {addLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddDepartmentDialog;
