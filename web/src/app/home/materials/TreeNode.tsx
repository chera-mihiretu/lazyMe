import React from "react";
import Image from "next/image";
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
  return (
    <div
      className={`flex items-center font-[Poppins,sans-serif] text-[16px] mb-[6px] relative transition-all duration-200
        ${isMaterial ?
          'px-4 py-2 rounded-[12px] bg-gradient-to-r from-[#f7f7fb] via-[#f7f7fb] to-[#e0e7ff] shadow-[0_2px_8px_#4320d11a] border-[1.5px] border-[#a5b4fc]'
          : expanded && isExpandable ?
            'px-2 py-1 rounded-[8px] bg-gradient-to-r from-[#ede9fe] via-[#ede9fe] to-[#e0e7ff] shadow-[0_2px_12px_#7c3aed22] border-[1.5px] border-[#a5b4fc]'
            : level % 2 === 0 ?
              'px-2 py-1 rounded-[8px] bg-white'
              : 'px-2 py-1 rounded-[8px] bg-[#f7f7fb]'}
      `}
      style={{ marginLeft: level * 28 }}
    >
      {isExpandable && (
        <button
          onClick={() => onExpand(node)}
          className={`mr-[10px] bg-transparent border-none cursor-pointer w-[28px] h-[28px] flex items-center justify-center rounded-full outline-none select-none transition-all duration-200 ${expanded ? 'shadow-[0_1px_4px_#7c3aed22]' : ''}`}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <Image
            src={expanded ? iconMap.expanded : iconMap.compressed}
            alt={expanded ? "Collapse" : "Expand"}
            width={22}
            height={22}
            className="w-[22px] h-[22px]"
          />
        </button>
      )}
      {/* Icon for each node type */}
      <span className="mr-[10px] flex items-center min-w-[24px] justify-center">
        <Image
          src={iconMap[node.type]}
          alt={node.type}
          width={22}
          height={22}
          className="w-[22px] h-[22px]"
        />
      </span>
      <span
        className="flex-1 flex flex-col justify-center min-w-0"
      >
        <span
          className={`block overflow-hidden text-ellipsis whitespace-nowrap ${node.type === "university" ? "font-bold" : node.type === "school" ? "font-semibold" : "font-medium"} ${isMaterial ? "text-[#4320d1] tracking-[0.2px]" : level === 0 ? "text-[#7c3aed]" : level === 1 ? "text-[#2563eb]" : "text-[#222]"}`}
        >
          {node.name}
        </span>
        {(node.type === "school" || node.type === "department") && node.description && (
          <span
            className="block text-[13px] text-[#666] mt-[2px] font-normal overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {node.description}
          </span>
        )}
      </span>
      {loading && <span className="ml-2 text-[#888] text-[14px]">Loading...</span>}
      {/* Material buttons */}
      {isMaterial && !loading && (
        <div className="flex gap-[10px] ml-[18px]">
            <a
              href={node.url}
              download
              className="inline-flex items-center gap-[6px] bg-[#f3f4f6] text-[#1e40af] border-none rounded-[8px] px-[18px] py-[6px] font-semibold text-[15px] cursor-pointer no-underline"
            >
              <Image src="/icons/download.png" alt="Download" width={20} height={20} /> Download
            </a>
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[6px] bg-[#fff7ed] text-[#92400e] border-none rounded-[8px] px-[18px] py-[6px] font-semibold text-[15px] cursor-pointer no-underline"
            >
              <Image src="/icons/read.png" alt="Read" width={20} height={20} /> Read
            </a>
        </div>
      )}
    </div>
  );
};

export default TreeNode;
