import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface School {
  id: string;
  name: string;
  description?: string;
}

export function useSchools(universityId: string) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!universityId) {
      setSchools([]);
      return;
    }
    setLoading(true);
    setError(null);
    let isMounted = true;
    let page = 1;
    let allSchools: School[] = [];
    const fetchSchools = async () => {
      try {
        let hasMore = true;
        while (hasMore) {
          const res = await fetch(`${baseUrl}/schools/?university_id=${universityId}&page=${page}`);
          const data = await res.json();
          if (Array.isArray(data.schools)) {
            allSchools = allSchools.concat(data.schools);
            hasMore = data.schools.length > 0 && (data.nextPage || data.hasMore || data.schools.length === (data.pageSize || 20));
            page++;
          } else {
            hasMore = false;
          }
        }
        if (isMounted) setSchools(allSchools);
      } catch (e) {
        if (isMounted) setError("Failed to load schools" + e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSchools();
    return () => { isMounted = false; };
  }, [universityId]);

  return { schools, loading, error };
}
