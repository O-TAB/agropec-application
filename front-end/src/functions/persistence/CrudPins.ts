import axios from 'axios';

import { point, StandEventResponse } from '../../data/ObjectStructures';
import { getAuthHeaders, BASE_URL } from './api';



export const RegisterNewpin =  async (PinData: StandEventResponse, mapid: string, type: string) => {
  try{
    const response = await axios.post(`${BASE_URL}/${type}/${mapid}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const UpdatePin =  async (PinData: StandEventResponse, idpin: number, type: string) => {
  try{
    const response = await axios.put(`${BASE_URL}/${type}/${idpin}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const DeletePin =  async (idpin: number, type: string) => {
  try{
    const response = await axios.delete(`${BASE_URL}/${type}/${idpin}`,getAuthHeaders());
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

export const RegisterNewPoint =  async (PointData: point, idmapa: string) => {
  try{
    const response = await axios.post(`${BASE_URL}/${idmapa}/point`,PointData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const UpdatePoint =  async (PointData: point, idpoint: number, idmapa: string) => {
  try{
    const response = await axios.put(`${BASE_URL}/${idmapa}/point/${idpoint}`,PointData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const DeletePoint =  async (idpoint: number, idmapa: string) => {
  try{
    const response = await axios.delete(`${BASE_URL}/${idmapa}/point/${idpoint}`,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const fetchAllPoints = async (idmapa: string): Promise<point[]> => {
    try {
      // Ensure token is available when fetching data
      const standsResponse = await axios.get(`${BASE_URL}/${idmapa}/point`, getAuthHeaders());
      console.log('standsResponse.data:', standsResponse.data);
      if (Array.isArray(standsResponse.data))
        return standsResponse.data as point[];
      return [];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
};

