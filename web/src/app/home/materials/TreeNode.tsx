import React from "react";
import { TreeNodeProps } from "./types";

const iconMap: Record<string, string> = {
  university: "/icons/school.png", // fallback to school icon for university
  school: "/icons/school.png",
  department: "/icons/school.png", // fallback, or add department.png if you have
  year: "/icons/year.png",
  semester: "/icons/semister.png",
  material: "/icons/material.png",
  expanded: "/icons/expanded.png",
  compressed: "/icons/compressed.png",
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onExpand, expanded, loading, childrenNodes }) => {
  const isExpandable = !node.isLeaf;
  const isMaterial = node.type === "material";
  return (
    <div
      style={{
        marginLeft: level * 28,
        display: "flex",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        fontSize: 16,
        padding: isMaterial ? "10px 16px" : "6px 8px",
        borderRadius: isMaterial ? 12 : 8,
        background: isMaterial
          ? "linear-gradient(90deg, #f7f7fb 60%, #e0e7ff 100%)"
          : expanded && isExpandable
            ? "linear-gradient(90deg, #ede9fe 60%, #e0e7ff 100%)"
            : level % 2 === 0
              ? "#fff"
              : "#f7f7fb",
        boxShadow: isMaterial
          ? "0 2px 8px #4320d11a"
          : expanded && isExpandable
            ? "0 2px 12px #7c3aed22"
            : undefined,
        marginBottom: 6,
        border: isMaterial
          ? "1.5px solid #a5b4fc"
          : expanded && isExpandable
            ? "1.5px solid #a5b4fc"
            : undefined,
        position: "relative",
        transition: "background 0.2s, box-shadow 0.2s, border 0.2s",
      }}
    >
      {isExpandable && (
        <button
          onClick={() => onExpand(node)}
          style={{
            marginRight: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            outline: "none",
            userSelect: "none",
            boxShadow: expanded ? "0 1px 4px #7c3aed22" : undefined,
            transition: "background 0.2s, color 0.2s",
          }}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <img
            src={expanded ? iconMap.expanded : iconMap.compressed}
            alt={expanded ? "Collapse" : "Expand"}
            style={{ width: 22, height: 22 }}
          />
        </button>
      )}
      {/* Icon for each node type */}
      <span style={{
        marginRight: 10,
        display: "flex",
        alignItems: "center",
        minWidth: 24,
        justifyContent: "center",
      }}>
        <img
          src={iconMap[node.type]}
          alt={node.type}
          style={{ width: 22, height: 22 }}
        />
      </span>
      <span
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontWeight: node.type === "university" ? 700 : node.type === "school" ? 600 : 500,
            color: isMaterial ? "#4320d1" : level === 0 ? "#7c3aed" : level === 1 ? "#2563eb" : "#222",
            letterSpacing: isMaterial ? 0.2 : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: 'block',
          }}
        >
          {node.name}
        </span>
        {(node.type === "school" || node.type === "department") && node.description && (
          <span
            style={{
              fontSize: 13,
              color: '#666',
              marginTop: 2,
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {node.description}
          </span>
        )}
      </span>
      {loading && <span style={{ marginLeft: 8, color: "#888", fontSize: 14 }}>Loading...</span>}
      {/* Material buttons */}
      {isMaterial && !loading && (
        <div style={{ display: "flex", gap: 10, marginLeft: 18 }}>
          <button
            style={{
              background: "linear-gradient(90deg, #6366f1 60%, #7c3aed 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 18px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 1px 4px #6366f133",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onClick={() => alert(`Download ${node.name}`)}
          >
            ⬇️ Download
          </button>
          <button
            style={{
              background: "linear-gradient(90deg, #fbbf24 60%, #f59e42 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 18px",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 1px 4px #fbbf2433",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onClick={() => alert(`View ${node.name}`)}
          >
            👁️ View
          </button>
        </div>
      )}
    </div>
  );
};

export default TreeNode;
