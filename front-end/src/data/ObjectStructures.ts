
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';


export interface point{
    name: string;
    typePoint: string;
    x: number;
    y: number;
}

export interface ResponsePoint extends point{
    id: number;
    name: string;
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
    point: ResponsePoint;
}

//estruturas vazias para rezetar os inputs

export const emptypoint: point = {
    name: '',
    typePoint: '',
    x: 0,
    y: 0,   
};

export const emptyStandEvent: StandEventPost = {
    name: '',
    description: '',
    descriptionCard: '',
    img: '',
    point: emptypoint
  };

