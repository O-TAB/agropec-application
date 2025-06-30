
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

export interface Map {
  id: string;
  name: string;
  svg: string;
}

export const FILTER_CONFIG = {
  "EXPOSITORES": {
    label: "Estande de Exposição",
    color: "bg-red-600 hover:bg-red-700",
    icon: "🏢"
  },
  "ESPACOSHOW": {
    label: "Espaço de Shows",
    color: "bg-purple-600 hover:bg-purple-700",
    icon: "🎭"
  },
  "ESPACOPALESTRA": {
    label: "Espaço de Palestras",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: "🎤"
  },
  "RESTAURANTE": {
    label: "Restaurante",
    color: "bg-orange-600 hover:bg-orange-700",
    icon: "🍽️"
  },
  "BANHEIROS": {
    label: "Banheiros",
    color: "bg-blue-400 hover:bg-blue-500",
    icon: "🚻"
  },
  "ESPACORACKATON": {
    label: "Espaço dos Rackatons",
    color: "bg-green-600 hover:bg-green-700",
    icon: "🏁"
  },
  "EMERGENCIA": {
    label: "Posto de Atendimento Médico",
    color: "bg-red-600 hover:bg-red-700",
    icon: "🚑"
  },
  "PARQUEDIVERSAO": {
    label: "Parque de Diversões",
    color: "bg-yellow-600 hover:bg-yellow-700",
    icon: "🎡"
  }
};

export interface Notification{
  content: string
}