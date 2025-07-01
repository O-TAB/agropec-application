

import axios from 'axios';
import { point, ResponsePoint, StandEventPost, StandEventResponse } from '../../data/ObjectStructures';
import { getAuthHeaders, BASE_URL, clearPointsCache, clearAllCache } from './api';

export const RegisterNewpin =  async (PinData: StandEventPost, mapid: string, type: string): Promise<boolean> => {
  try{
    const response = await axios.post(`${BASE_URL}/${type}/${mapid}`,PinData ,getAuthHeaders());
    clearAllCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Registro): ', error);
      return false;
  }
}

export const UpdatePin =  async (PinData: StandEventResponse | StandEventPost, idpin: number, type: string): Promise<boolean> => {
  try{
    const response = await axios.put(`${BASE_URL}/${type}/${idpin}`, PinData, getAuthHeaders());
    clearAllCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Update): ', error.response?.data || error.message);
      return false;
  }
}

export const DeletePin =  async (idpin: number, type: string): Promise<boolean> => {
  try{
    await axios.delete(`${BASE_URL}/${type}/${idpin}`,getAuthHeaders());
    clearAllCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Delete): ', error);
      return false;
  }
}

export const fetchAllStandsData = async (): Promise<StandEventResponse[]> => {
    try {
      const standsResponse = await axios.get(`${BASE_URL}/stands`, getAuthHeaders());
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
      const standsResponse = await axios.get(`${BASE_URL}/event`, getAuthHeaders());
      if (Array.isArray(standsResponse.data))
        return standsResponse.data as StandEventResponse[];
      return [];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};

export const RegisterNewPoint = async (PointData: point, idmapa: string): Promise<boolean> => {
  try{
    await axios.post(`${BASE_URL}/map/${idmapa}/point`, PointData, getAuthHeaders());
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const UpdatePoint = async (PointData: point, idpoint: number, idmapa: string): Promise<boolean> => {
  try{
    await axios.put(`${BASE_URL}/map/${idmapa}/point/${idpoint}`, PointData, getAuthHeaders());
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const DeletePoint = async (idpoint: number, idmapa: string): Promise<boolean> => {
  try{
    await axios.delete(`${BASE_URL}/map/${idmapa}/point/${idpoint}`, getAuthHeaders());
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      return false;
  }
}

export const fetchAllPoints = async (idmapa: string): Promise<ResponsePoint[]> => {
    try {
      const standsResponse = await axios.get(`${BASE_URL}/map/${idmapa}/point`, getAuthHeaders());
       if (Array.isArray(standsResponse.data))
        return standsResponse.data as ResponsePoint[];
      return [];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};