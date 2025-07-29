export interface Department {
  id: string;
  name: string;
  description: string;
  school_id: string;
  years?: number; // Optional, if not specified, defaults to 4
}
