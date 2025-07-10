export interface MaterialNode {
  id: string;
  name: string;
  type: "university" | "school" | "department" | "year" | "semester" | "material";
  children?: MaterialNode[];
  isLeaf?: boolean;
  years?: number; // for department
  departmentId?: string; // for year, semester
  year?: string; // for semester
  semester?: number; // for semester
  url?: string; // for material
  description?: string; // for school, department
}

export interface TreeNodeProps {
  node: MaterialNode;
  level: number;
  onExpand: (node: MaterialNode) => void;
  expanded: boolean;
  loading: boolean;
  childrenNodes: MaterialNode[] | undefined;
}
