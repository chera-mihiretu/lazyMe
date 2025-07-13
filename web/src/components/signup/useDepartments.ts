import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface Department {
  id: string;
  name: string;
  years?: number;
  description?: string;
}

export function useDepartments(schoolId: string) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setDepartments([]);
      return;
    }
    setLoading(true);
    setError(null);
    let isMounted = true;
    fetch(`${baseUrl}/departments/tree?school_id=${schoolId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setDepartments(Array.isArray(data.departments) ? data.departments : []);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load departments");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [schoolId]);

  return { departments, loading, error };
}
