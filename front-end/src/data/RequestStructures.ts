
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';


export type point = {
    id: number;
    typePoint: string;
    x: number;
    y: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ResponseLogin{
    token: string;

    username: string;
    email: string;
    role: string;
}

export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface mapPost {
    
    name: string;
    svg: string;
}

export interface StandEventPost{
    name: string;
    description: string;
    descriptionCard: string;
    img: string;
    point: point;
    Date?: string;
}

export interface StandEventResponse extends StandEventPost {
    id: number;
}


