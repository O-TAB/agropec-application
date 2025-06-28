import axios from 'axios';

import { point, ResponsePoint, StandEventPost, StandEventResponse } from '../../data/ObjectStructures';
import { getAuthHeaders, BASE_URL, clearPointsCache, clearStandsCache } from './api';



export const RegisterNewpin =  async (PinData: StandEventPost, mapid: string, type: string): Promise<boolean> => {
  try{
    const response = await axios.post(`${BASE_URL}/${type}/${mapid}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const UpdatePin =  async (PinData: StandEventResponse | StandEventPost, idpin: number, type: string): Promise<boolean> => {
  try{
    const response = await axios.put(`${BASE_URL}/${type}/${idpin}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const DeletePin =  async (idpin: number, type: string): Promise<boolean> => {
  try{
    const response = await axios.delete(`${BASE_URL}/${type}/${idpin}`,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
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

export const RegisterNewPoint = async (PointData: point, idmapa: string): Promise<boolean> => {
  try{
    const response = await axios.post(`${BASE_URL}/map/${idmapa}/point`, PointData, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearPointsCache(); // Limpa o cache após adicionar novo ponto
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const UpdatePoint = async (PointData: point, idpoint: number, idmapa: string): Promise<boolean> => {
  try{
    const response = await axios.put(`${BASE_URL}/map/${idmapa}/point/${idpoint}`, PointData, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearPointsCache(); // Limpa o cache após atualizar ponto
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const DeletePoint = async (idpoint: number, idmapa: string): Promise<boolean> => {
  try{
    const response = await axios.delete(`${BASE_URL}/map/${idmapa}/point/${idpoint}`, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    clearPointsCache(); // Limpa o cache após deletar ponto
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const fetchAllPoints = async (idmapa: string): Promise<ResponsePoint[]> => {
    try {
      // Ensure token is available when fetching data
      const standsResponse = await axios.get(`${BASE_URL}/map/${idmapa}/point`, getAuthHeaders());
      console.log('ResponsePoint.data:', standsResponse.data);
      if (Array.isArray(standsResponse.data))
        return standsResponse.data as ResponsePoint[];
      return [];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};

