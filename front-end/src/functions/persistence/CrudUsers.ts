import { BASE_URL, getAuthHeaders } from "./api";
import { RegisterUserRequest } from "../../data/ObjectStructures";
import axios from "axios";

export const RegisterNewUser =  async (userData: RegisterUserRequest) => {
  try{
    const response = await axios.post(`${BASE_URL}/auth/login/register`,userData ,getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
      console.error('Error fetching data: ', error);
      throw error;
  }
}

export const UpdateUser = async (userId: string, userData: RegisterUserRequest) => {
  try{
    const response = await axios.put(`${BASE_URL}/auth/login/${userId}`, userData, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
      console.error('Error updating user: ', error);
      throw error;
  }
}

export const GetAllUsers = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/auth/login/users`, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
      console.error('Error fetching users: ', error);
      throw error;
  }
}

export const DeleteUser = async (userID: string)=>{
  try{
    const response = await axios.delete(`${BASE_URL}/auth/login/delete/${userID}`, getAuthHeaders());
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error: any) {
      console.error('Error Deleting user: ', error);
      throw error;
  }
}
