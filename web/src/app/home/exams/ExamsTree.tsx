import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TreeNode from "../materials/TreeNode";
import { MaterialNode } from "../materials/types";
import { University } from "@/types/university";
import { School } from "@/types/schools";
import { Department } from "@/types/department";
import { Material } from "@/types/material";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ExamsTree: React.FC = () => {
  const [tree, setTree] = useState<MaterialNode[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [children, setChildren] = useState<Record<string, MaterialNode[]>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/universities/`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.universities)) {
          setTree(data.universities.map((u: University) => ({ id: u.id, name: u.name, type: "university" })));
        }
        setIsInitialLoading(false);
      })
      .catch(() => setIsInitialLoading(false));
  }, []);

  const handleExpand = async (node: MaterialNode) => {
    setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
    if (!expanded[node.id] && !children[node.id]) {
      setLoading((prev) => ({ ...prev, [node.id]: true }));
      let nodes: MaterialNode[] = [];
      const token = localStorage.getItem("token");
      const headers = { Authorization: token ? `Bearer ${token}` : "" };
      try {
        if (node.type === "university") {
          let page = 1;
          let allSchools: School[] = [];
          let hasMore = true;
          while (hasMore) {
            const res = await fetch(`${baseUrl}/schools/?university_id=${node.id}&page=${page}`, { headers });
            const data = await res.json();
            if (Array.isArray(data.schools)) {
              allSchools = allSchools.concat(data.schools);
              hasMore = data.schools.length > 0 && (data.nextPage || data.hasMore || data.schools.length === (data.pageSize || 20));
              page++;
            } else {
              hasMore = false;
            }
          }
          nodes = allSchools.map((s: School) => ({ id: s.id, name: s.name, type: "school", description: s.description }));
        } else if (node.type === "school") {
          const res = await fetch(`${baseUrl}/departments/tree/${node.id}`, { headers });
          const data = await res.json();
          if (Array.isArray(data.departments)) {
            nodes = data.departments.map((d: Department) => ({ id: d.id, name: d.name, type: "department", years: d.years, description: d.description }));
          }
        } else if (node.type === "department") {
          const years = node.years || 4;
          nodes = Array.from({ length: years }, (_, i) => ({
            id: `${node.id}-year${i + 1}`,
            name: `Year ${i + 1}`,
            type: "year",
            departmentId: node.id,
          }));
        } else if (node.type === "year") {
          nodes = [
            { id: `${node.id}-sem1`, name: "Semester 1", type: "semester", year: node.name, departmentId: node.departmentId, semester: 1 },
            { id: `${node.id}-sem2`, name: "Semester 2", type: "semester", year: node.name, departmentId: node.departmentId, semester: 2 },
          ];
        } else if (node.type === "semester") {
          const yearNum = parseInt((node.year || '').replace(/[^0-9]/g, ''));
          // Only this endpoint changes:
          const res = await fetch(`${baseUrl}/exams/tree?department_id=${node.departmentId}&year=${yearNum}&semester=${node.semester}`, { headers });
          const data = await res.json();
          if (Array.isArray(data.exams)) {
            nodes = data.exams.map((m: Material) => ({ id: m.id, name: m.title, type: "material", isLeaf: true, url: m.file }));
          }
        }
      } catch (e) {
        console.log(e);
      }
      setChildren((prev) => ({ ...prev, [node.id]: nodes }));
      setLoading((prev) => ({ ...prev, [node.id]: false }));
    }
  };

  const renderTree = (nodes: MaterialNode[], level = 0) =>
    nodes.map((node, index) => (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="w-full sm:w-auto"
      >
        <TreeNode
          node={node}
          level={level}
          onExpand={handleExpand}
          expanded={!!expanded[node.id]}
          loading={!!loading[node.id]}
          childrenNodes={children[node.id]}
        />
        <AnimatePresence>
          {expanded[node.id] && children[node.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {renderTree(children[node.id], level + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    ));

  if (isInitialLoading) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <motion.div
            className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        <motion.p
          className="text-center text-gray-600 mt-4 text-base"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading universities...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with gradient and icon */}
      <motion.div
        className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </motion.div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Past Exams
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Browse by university and department</p>
        </div>
      </motion.div>

      {/* Tree Content */}
      <motion.div
        className="space-y-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-max sm:min-w-0">
            {tree.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <p className="text-gray-500 text-base">No universities found.</p>
                <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
              </motion.div>
            ) : (
              renderTree(tree)
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExamsTree;
