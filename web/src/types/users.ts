
export interface UserRequest {
    name: string;
    email: string;
    password: string;
    acedemic_year: number;
    university_id?: string;
    school_id?: string;
    department_id?: string;
}