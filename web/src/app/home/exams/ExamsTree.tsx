import React, { useEffect, useState } from "react";
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
      });
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
    nodes.map((node) => (
      <div key={node.id}>
        <TreeNode
          node={node}
          level={level}
          onExpand={handleExpand}
          expanded={!!expanded[node.id]}
          loading={!!loading[node.id]}
          childrenNodes={children[node.id]}
        />
        {expanded[node.id] && children[node.id] && renderTree(children[node.id], level + 1)}
      </div>
    ));

  return (
    <div style={{ maxWidth: 1200, minWidth: 400, margin: "3rem auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #4320d10a", padding: 48 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 32 }}>Exams</h2>
      {tree.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No universities found.</div>
      ) : (
        renderTree(tree)
      )}
    </div>
  );
};

export default ExamsTree;
