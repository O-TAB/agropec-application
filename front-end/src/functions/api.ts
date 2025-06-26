import axios from 'axios';
import {StandEventResponse, RegisterUserRequest, StandEventPost} from '../data/RequestStructures';


const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};


const BASE_URL = 'http://localhost:8080';
let cachedDataStands: StandEventResponse[] | null = null;
let cachedDataEvents: StandEventResponse[] | null = null;
let isLoadingData: boolean = false; // Para evitar requisições simultâneas

export const uploadMap = async (svgContent: string, name = "Mapa") => {
  try {
    const formData = new FormData();
    // Cria um arquivo Blob com o conteúdo SVG
    const svgFile = new Blob([svgContent], { type: 'image/svg+xml' });
    formData.append('archive', svgFile, 'mapa.svg'); // 'archive' é o nome do parâmetro esperado no backend
    formData.append('name', name); // se o backend espera o nome do mapa

    const response = await axios.post(
      `${BASE_URL}/map`,
      formData,
      {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          // NÃO defina 'Content-Type', o axios faz isso automaticamente para FormData!
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getFirstMapId =  async (): Promise<string | null> => {
  try{
    const response = await axios.get(`${BASE_URL}/map`,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    const maps = response.data;
    if(Array.isArray(maps) && maps.length > 0 && maps[0].id){
      return maps[0].id
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

export const RegisterNewUser =  async (userData: RegisterUserRequest) => {
  try{
    const response = await axios.post(`${BASE_URL}/auth/login/register`,userData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const DeleteUser = async (userID: string)=>{
  try{
    const response = await axios.delete(`${BASE_URL}/auth/login/delete/${userID}`, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error Deleting user: ', error);
  }
}

export const RegisterNewpin =  async (StandData: StandEventPost, mapid: string, type: string) => {
  try{
    console.log(JSON.stringify(StandData, null, 2));

    const response = await axios.post(`${BASE_URL}/${type}/${mapid}`,StandData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const UpdatePin =  async (PinData: StandEventPost, namePin: string, type: string) => {
  try{
    const response = await axios.put(`${BASE_URL}/${type}/${namePin}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const DeletePin =  async (namePin: string, type: string) => {
  try{
    const response = await axios.delete(`${BASE_URL}/${type}/${namePin}`,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const fetchAllStandsData = async (): Promise<StandEventResponse[]> => {
    try {
      // Ensure token is available when fetching data
      const standsResponse = await axios.get(`${BASE_URL}/stands`, getAuthHeaders());
      console.log('standsResponse.data:', standsResponse.data);
      if (Array.isArray(standsResponse.data))
        return standsResponse.data as StandEventResponse[];
      return [];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};

export async function getMyObjectsStands(): Promise<StandEventResponse[]> {
  if (cachedDataStands) {
    console.log('Dados recuperados do cache.');
    return cachedDataStands;
  }

  if (isLoadingData) {
    console.log('Dados já sendo carregados, aguardando...');
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!isLoadingData && cachedDataStands) {
          clearInterval(checkInterval);
          resolve(cachedDataStands);
        }
      }, 100);
    });
  }
  isLoadingData = true;
  console.log('Buscando dados da API pela primeira vez ou cache vazio...');
  try {
    const data = await fetchAllStandsData();
    cachedDataStands = data; // Armazena em cache
    return data;
  } finally {
    isLoadingData = false;
  }
}

export const fetchAllEventData = async (): Promise<StandEventResponse[]> => {
    try {
      // Ensure token is available when fetching data
      const standsResponse = await axios.get(`${BASE_URL}/event`, getAuthHeaders());
      console.log('standsResponse.data:', standsResponse.data);
      return standsResponse.data as StandEventResponse[];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};

export async function getMyObjectsEvent(): Promise<StandEventResponse[]> {
  if (cachedDataEvents) {
    console.log('Dados recuperados do cache.');
    return cachedDataEvents;
  }

  if (isLoadingData) {
    console.log('Dados já sendo carregados, aguardando...');
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!isLoadingData && cachedDataEvents) {
          clearInterval(checkInterval);
          resolve(cachedDataEvents);
        }
      }, 100);
    });
  }
  isLoadingData = true;
  console.log('Buscando dados da API pela primeira vez ou cache vazio...');
  try {
    const data = await fetchAllEventData();
    cachedDataEvents = data; // Armazena em cache
    return data;
  } finally {
    isLoadingData = false;
  }
}


export const debugdata = () => {
  console.log('Dados de stands:', cachedDataStands);
  console.log('Dados de eventos:', cachedDataEvents);
  
}





