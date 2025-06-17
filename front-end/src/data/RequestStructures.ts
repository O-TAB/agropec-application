

export type point = {
    id: number;
    name: string;
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

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface mapPost {
    
    name: string;
    svg: string;
}

export interface standPost{
    name: string;
    description: string;
    descriptioncard: string;
    image: string;

    point: point;
}

export interface standResponse extends standPost {
    id: number;
}

export interface eventPost extends standPost {
    Date: string;
}

export interface eventResponse extends eventPost {
    id: number;
}