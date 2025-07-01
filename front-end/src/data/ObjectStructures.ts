
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
    date?: string;
    point: point;
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
    color: "bg-green-500 hover:bg-green-600 text-white shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "ESPACOSHOW": {
    label: "Espaço de Shows",
    color: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "ESPACOPALESTRA": {
    label: "Espaço de Palestras",
    color: "bg-lime-500 hover:bg-lime-600 text-black shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "RESTAURANTE": {
    label: "Restaurante",
    color: "bg-green-700 hover:bg-green-800 text-white shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "BANHEIROS": {
    label: "Banheiros",
    color: "bg-teal-500 hover:bg-teal-600 text-white shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "ESPACORACKATON": {
    label: "Espaço dos Rackatons",
    color: "bg-green-400 hover:bg-green-500 text-black shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "EMERGENCIA": {
    label: "Posto de Atendimento Médico",
    color: "bg-green-800 hover:bg-green-900 text-white shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  },
  "PARQUEDIVERSAO": {
    label: "Parque de Diversões",
    color: "bg-lime-300 hover:bg-lime-400 text-black shadow-md rounded-xl px-4 py-2 transition-all",
    icon: ""
  }
};


export interface Notification{
  content: string
}