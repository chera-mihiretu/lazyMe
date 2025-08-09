import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, X, AlertTriangle, Loader2, Plus, ChevronDown, Upload } from 'lucide-react';
import { Department } from "../../types/department";
import { University } from "../signup/useUniversities";
import { School } from "../signup/useSchools";
import Image from "next/image";

interface AddMaterialDialogProps {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingUniversities(true);
    fetch(baseUrl + "/universities/")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities.map((u: University) => ({ id: u.id, name: u.name })));
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
        }
        setLoadingSchools(false);
      })
      .catch(() => {
        setLoadingSchools(false);
      });
  }, [selectedUniversity]);

  useEffect(() => {
    if (!selectedSchool) {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }
    setLoadingDepartments(true);
    fetch(`${baseUrl}/departments/tree/${selectedSchool}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        }
        setLoadingDepartments(false);
      })
      .catch(() => {
        setLoadingDepartments(false);
      });
  }, [selectedSchool]);

  const handleSubmit = async () => {
    setAddError("");
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", materialName);
      formData.append("department_id", selectedDepartment);
      if (year) formData.append("year", year);
      if (semester) formData.append("semester", semester);
      if (materialFile) formData.append("file", materialFile);

      const res = await fetch(baseUrl + "/materials/", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add material");
      }
      setMaterialName("");
      setSelectedUniversity("");
      setSelectedSchool("");
      setSelectedDepartment("");
      setMaterialFile(null);
      setYear("");
      setSemester("");
      onClose();
    } catch (err) {
      setAddError("Error adding material" + err);
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
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <FileImage className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Add Material</h3>
                  <p className="text-sm text-gray-500">Upload a new material</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none bg-white pr-10"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none bg-white pr-10"
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
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={selectedDepartment}
                    onChange={e => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 appearance-none bg-white pr-10"
                    disabled={addLoading || !selectedSchool}
                  >
                    <option value="">{loadingDepartments ? "Loading..." : "Select Department"}</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Name *
                </label>
                <input
                  type="text"
                  value={materialName}
                  onChange={e => setMaterialName(e.target.value)}
                  placeholder="Enter material name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                  disabled={addLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year (Optional)
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="Enter year"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                    disabled={addLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester (Optional)
                  </label>
                  <input
                    type="number"
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    placeholder="Enter semester"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
                    disabled={addLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material PDF *
                </label>
                <div className="flex items-center gap-3">
                  <motion.label
                    htmlFor="material-pdf-upload"
                    className="flex items-center cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image src="/icons/pdf-file.png" alt="PDF" width={20} height={20} className="mr-2" />
                    <Upload className="w-4 h-4 mr-2 text-pink-600" />
                    <span className="text-sm font-medium text-pink-600">Upload PDF</span>
                    <input
                      id="material-pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={e => {
                        const file = e.target.files && e.target.files[0];
                        setMaterialFile(file || null);
                      }}
                      className="hidden"
                      disabled={addLoading}
                    />
                  </motion.label>
                  {materialFile && (
                    <motion.div
                      className="flex-1 p-2 bg-pink-50 border border-pink-200 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-sm text-pink-700 font-medium truncate">
                        {materialFile.name}
                      </p>
                    </motion.div>
                  )}
                </div>
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!selectedUniversity || !selectedSchool || !selectedDepartment || !materialName.trim() || !materialFile || addLoading}
                whileHover={{ scale: (!selectedUniversity || !selectedSchool || !selectedDepartment || !materialName.trim() || !materialFile || addLoading) ? 1 : 1.02 }}
                whileTap={{ scale: (!selectedUniversity || !selectedSchool || !selectedDepartment || !materialName.trim() || !materialFile || addLoading) ? 1 : 0.98 }}
              >
                {addLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material
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

export default AddMaterialDialog;
