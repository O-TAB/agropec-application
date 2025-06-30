// src/functions/persistence/CrudPins.ts - CORRIGIDO

import axios from 'axios';
import { point, ResponsePoint, StandEventPost, StandEventResponse } from '../../data/ObjectStructures';
import { getAuthHeaders, BASE_URL, clearPointsCache, clearStandsCache } from './api';

export const RegisterNewpin =  async (PinData: StandEventPost, mapid: string, type: string): Promise<boolean> => {
  try{
    const response = await axios.post(`${BASE_URL}/${type}/${mapid}`,PinData ,getAuthHeaders());
    console.log('Resposta do servidor (Registro):', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Registro): ', error);
      return false;
  }
}

// ==================================================================
// FUNÇÃO CORRIGIDA
// ==================================================================
export const UpdatePin =  async (PinData: StandEventResponse | StandEventPost, idpin: number, type: string): Promise<boolean> => {
  
  // 1. Criamos um objeto "limpo" para enviar ao backend.
  // Isso evita enviar campos desnecessários como o 'id' do próprio stand ou o objeto 'point' inteiro.
  const updatePayload = {
    name: PinData.name,
    description: PinData.description,
    descriptionCard: PinData.descriptionCard,
    img: PinData.img,
    // 2. Assumimos que o backend espera o ID do ponto, e não o objeto 'point' completo.
    // Usamos optional chaining (?.) para não dar erro se o 'point' for nulo.
    pointId: (PinData.point as ResponsePoint)?.id 
  };

  // 3. (Opcional, mas boa prática) Removemos a propriedade pointId se ela for undefined.
  if (updatePayload.pointId === undefined) {
    delete (updatePayload as Partial<typeof updatePayload>).pointId;
  }

  // Adicionamos logs para facilitar a depuração no futuro.
  console.log("Objeto original recebido pela função:", PinData);
  console.log("Payload que será enviado para o backend:", JSON.stringify(updatePayload, null, 2));

  try{
    // 4. Enviamos o novo objeto 'updatePayload' em vez do 'PinData' original.
    const response = await axios.put(`${BASE_URL}/${type}/${idpin}`, updatePayload, getAuthHeaders());
    console.log('Resposta do servidor (Update):', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Update): ', error.response?.data || error.message);
      return false;
  }
}

// O restante do arquivo continua igual...
export const DeletePin =  async (idpin: number, type: string): Promise<boolean> => {
  try{
    const response = await axios.delete(`${BASE_URL}/${type}/${idpin}`,getAuthHeaders());
    console.log('Resposta do servidor (Delete):', response.data);
    clearStandsCache();
    clearPointsCache();
    return true;
  } catch (error: any) {
      console.error('Error fetching data (Delete): ', error);
      return false;
  }
}

// ... (todas as outras funções fetchAllStandsData, fetchAllEventData, etc. continuam aqui)
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
    clearPointsCache(); 
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
    clearPointsCache();
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