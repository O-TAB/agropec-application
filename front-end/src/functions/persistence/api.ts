import axios from 'axios';
import {point, StandEventResponse} from '../../data/ObjectStructures';
import { fetchAllStandsData, fetchAllEventData, fetchAllPoints} from './CrudPins';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const BASE_URL = 'http://localhost:8080';
let cachedDataStands: StandEventResponse[] | [];
let cachedDataEvents: StandEventResponse[] | [];
let cachedPoints: point[] | [];
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

export const getFirstMapId =  async (): Promise<string> => {
  try{
    const response = await axios.get(`${BASE_URL}/map`,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    const maps = response.data;
    if(Array.isArray(maps) && maps.length > 0 && maps[0].id){
      return maps[0].id
    }
    return '';
  } catch (error: any) {
    console.error('Error fetching data: ', error);
    return '';
  }
}
 

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

export async function getMypoints(idmap: string): Promise<point[]> {
  if (cachedPoints) {
    console.log('Dados recuperados do cache.');
    return cachedPoints;
  }

  if (isLoadingData) {
    console.log('Dados já sendo carregados, aguardando...');
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!isLoadingData && cachedPoints) {
          clearInterval(checkInterval);
          resolve(cachedPoints);
        }
      }, 100);
    });
  }
  isLoadingData = true;
  console.log('Buscando dados da API pela primeira vez ou cache vazio...');
  try {
    const data = await fetchAllPoints(idmap);
    cachedPoints = data; // Armazena em cache
    return data;
  } finally {
    isLoadingData = false;
  }
}



export const debugdata = () => {
  console.log('Dados de stands:', cachedDataStands);
  console.log('Dados de eventos:', cachedDataEvents);
  console.log('Dados de pontos:', cachedPoints);
}





