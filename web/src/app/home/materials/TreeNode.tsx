import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TreeNodeProps } from "./types";

const iconMap: Record<string, string> = {
  university: "/icons/university.png", // fallback to school icon for university
  school: "/icons/school.png",
  department: "/icons/department.png", // fallback, or add department.png if you have
  year: "/icons/year.png",
  semester: "/icons/semister.png",
  material: "/icons/material.png",
  expanded: "/icons/expanded.png",
  compressed: "/icons/compressed.png",
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onExpand, expanded, loading }) => {
  const isExpandable = !node.isLeaf;
  const isMaterial = node.type === "material";
  
  // Define colors and styles based on node type and level
  const getNodeStyles = () => {
    if (isMaterial) {
      return {
        container: "bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 border-2 border-emerald-200/60 shadow-md hover:shadow-lg",
        text: "text-emerald-700 font-semibold",
        icon: "bg-gradient-to-br from-emerald-400 to-blue-500"
      };
    } else if (expanded && isExpandable) {
      return {
        container: "bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200/60 shadow-sm hover:shadow-md",
        text: level === 0 ? "text-purple-700 font-bold" : level === 1 ? "text-blue-700 font-semibold" : "text-indigo-600 font-medium",
        icon: "bg-gradient-to-br from-purple-400 to-blue-500"
      };
    } else {
      return {
        container: "bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/60 shadow-sm hover:shadow-md",
        text: level === 0 ? "text-gray-800 font-bold" : level === 1 ? "text-gray-700 font-semibold" : "text-gray-600 font-medium",
        icon: "bg-gradient-to-br from-gray-300 to-gray-400"
      };
    }
  };

  const styles = getNodeStyles();

  return (
    <motion.div
      className={`flex items-center rounded-xl p-2 sm:p-3 mb-2 transition-all duration-300 ${styles.container}`}
      style={{ marginLeft: level * 20 }}
      whileHover={{ scale: 1.01, x: 3 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Expand/Collapse Button */}
      {isExpandable && (
        <motion.button
          onClick={() => onExpand(node)}
          className="mr-3 bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-full outline-none select-none transition-all duration-200 hover:bg-white/50"
          whileHover={{ scale: 1.1, rotate: expanded ? -90 : 0 }}
          whileTap={{ scale: 0.95 }}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
        >
          <Image
            src={expanded ? iconMap.expanded : iconMap.compressed}
            alt={expanded ? "Collapse" : "Expand"}
              width={20}
              height={20}
              className="w-5 h-5"
          />
          </motion.div>
        </motion.button>
      )}

      {/* Node Type Icon */}
      <motion.div
        className={`mr-3 flex items-center justify-center min-w-[40px] h-10 rounded-lg shadow-sm ${styles.icon}`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={iconMap[node.type]}
          alt={node.type}
          width={20}
          height={20}
          className="w-5 h-5 filter brightness-0 invert"
        />
      </motion.div>

      {/* Node Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <motion.span
          className={`block overflow-hidden text-ellipsis whitespace-nowrap text-sm sm:text-base ${styles.text}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {node.name}
        </motion.span>
        
        {/* Description for school and department */}
        {(node.type === "school" || node.type === "department") && node.description && (
          <motion.span
            className="block text-xs sm:text-sm text-gray-500 mt-0.5 font-normal overflow-hidden text-ellipsis whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {node.description}
          </motion.span>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          className="ml-3 flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-gray-500 text-xs font-medium">Loading...</span>
        </motion.div>
      )}

      {/* Material Action Buttons */}
      {isMaterial && !loading && (
        <motion.div
          className="flex gap-1 sm:gap-2 ml-2 sm:ml-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.a
              href={node.url}
              download
            className="group inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 font-semibold text-xs cursor-pointer no-underline shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image src="/icons/download.png" alt="Download" width={14} height={14} className="filter brightness-0 invert" />
            </motion.div>
            <span className="hidden xs:inline">Download</span>
            <span className="xs:hidden">DL</span>
          </motion.a>
          
          <motion.a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-orange-400 to-red-500 text-white border-none rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 font-semibold text-xs cursor-pointer no-underline shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image src="/icons/read.png" alt="Read" width={14} height={14} className="filter brightness-0 invert" />
            </motion.div>
            <span className="hidden xs:inline">Read</span>
            <span className="xs:hidden">R</span>
          </motion.a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TreeNode;
