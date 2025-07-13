import { useMemo } from "react";
import type { Department } from "./useDepartments";

export function useYears(departmentId: string, departments: Department[]) {
  return useMemo(() => {
    if (!departmentId) return [];
    const dep = departments.find((d) => d.id === departmentId);
    const years = dep?.years || 4;
    return Array.from({ length: years }, (_, i) => ({
      value: `${i + 1}`,
      label: `${i + 1}${getOrdinal(i + 1)} Year`,
    }));
  }, [departmentId, departments]);
}

function getOrdinal(n: number) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}
