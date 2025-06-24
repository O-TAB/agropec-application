import axios from 'axios';
import {StandEventResponse, RegisterUserRequest} from '../data/RequestStructures';


const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};


const BASE_URL = 'http://localhost:8080';
let cachedDataStands: StandEventResponse[] | null = null;
let cachedDataEvents: StandEventResponse[] | null = null;
let isLoadingData: boolean = false; // Para evitar requisições simultâneas

const config = getAuthHeaders();

export const RegisterNewUser =  async (userData: RegisterUserRequest) => {
  try{
    const response = await axios.post(`${BASE_URL}/auth/login/register`,userData ,config);
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error fetching data: ', error);
  }
}

export const DeleteUser = async (userID: string)=>{
  try{
    const response = await axios.delete(`${BASE_URL}/auth/login/delete/${userID}`, config);
    console.log('Resposta do servidor:', response.data);
  } catch (error: any) {
      console.error('Error Deleting user: ', error);
  }
}

export const fetchAllStandsData = async (): Promise<StandEventResponse[]> => {
    try {
      // Ensure token is available when fetching data
      const standsResponse = await axios.get(`${BASE_URL}/stands`, config);
      console.log('standsResponse.data:', standsResponse.data);
      return standsResponse.data as StandEventResponse[];
    } catch (error: any) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

export async function getMyObjects(): Promise<StandEventResponse[]> {
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

export const debugdata = () => {
  console.log('Dados de stands:', cachedDataStands);
  console.log('Dados de eventos:', cachedDataEvents);
  console.log('Dados de eventos:', cachedDataEvents);
}





