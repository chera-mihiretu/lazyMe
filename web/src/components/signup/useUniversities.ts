import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface University {
  id: string;
  name: string;
  description?: string;
}

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${baseUrl}/universities/`)
      .then((res) => res.json())
      .then((data) => {
        setUniversities(Array.isArray(data.universities) ? data.universities : []);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load universities");
        setLoading(false);
      });
  }, []);

  return { universities, loading, error };
}
