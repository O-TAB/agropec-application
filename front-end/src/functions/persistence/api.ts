import axios from 'axios';
import {Map, ResponsePoint, StandEventResponse} from '../../data/ObjectStructures';
import { fetchAllStandsData, fetchAllEventData, fetchAllPoints} from './CrudPins';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const BASE_URL = 'http://localhost:8080';
let cachedDataStands: StandEventResponse[] | null = null;
let cachedDataEvents: StandEventResponse[] | null = null;
let cachedPoints: ResponsePoint[] | null = null;
let isLoadingData: boolean = false; 

export const clearStandsCache = () => { cachedDataStands = null; };
export const clearEventsCache = () => { cachedDataEvents = null; };
export const clearPointsCache = () => { cachedPoints = null; };
export const clearAllCache = () => {
  cachedDataStands = null;
  cachedDataEvents = null;
  cachedPoints = null;
};

export const uploadMap = async (svgContent: string, name = "Mapa") => {
  try {
    const formData = new FormData();
    const svgFile = new Blob([svgContent], { type: 'image/svg+xml' });
    formData.append('archive', svgFile, 'mapa.svg'); 
    formData.append('name', name);

    const response = await axios.post(`${BASE_URL}/map`, formData, { ...getAuthHeaders() });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getMapById = async (mapId: string): Promise<Map | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/map/${mapId}`, getAuthHeaders());
    return response.data as Map;
  } catch (error: any) {
    console.error('Error fetching map by id: ', error);
    return null;
  }
};

export const getFirstMapId =  async (): Promise<string> => {
  try{
    const response = await axios.get(`${BASE_URL}/map`,getAuthHeaders());
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
  if (cachedDataStands) return cachedDataStands;
  try {
    const data = await fetchAllStandsData();
    cachedDataStands = data;
    return data;
  } catch (error) {
    return [];
  }
}

export async function getMyObjectsEvent(): Promise<StandEventResponse[]> {
  console.log(cachedDataEvents);
  if (cachedDataEvents) return cachedDataEvents;
  try {
    const data = await fetchAllEventData();
    cachedDataEvents = data;
    return data;
  } catch(error) {
    return [];
  }
}

export async function getMypoints(idmap: string): Promise<ResponsePoint[]> {
  if (!idmap) return [];
  if (cachedPoints) return cachedPoints;
  try {
    const data = await fetchAllPoints(idmap);
    cachedPoints = data;
    return data;
  } catch (error) {
    return [];
  }
}

export const getDetailsById = async (id: number, typePoint: string): Promise<StandEventResponse | null> => {
  const endpointType = typePoint === 'EXPOSITORES' ? 'stands' : 'event'; // Simplificação, ajuste se tiver mais tipos
  try {
    const response = await axios.get(`${BASE_URL}/${endpointType}/${id}`, getAuthHeaders());
    return response.data as StandEventResponse;
  } catch (error) {
    console.error(`Erro ao buscar detalhes para o item ${id}:`, error);
    return null;
  }
};