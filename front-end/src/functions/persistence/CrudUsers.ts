import { BASE_URL, getAuthHeaders } from "./api";
import { RegisterUserRequest } from "../../data/ObjectStructures";

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
