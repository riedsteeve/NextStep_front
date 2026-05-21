import axios from "axios";

const URL_APPLICATION = import.meta.env.VITE_APPLICATION_API;

export const candidatureService = {
 async getAll(token: string | null){
  if (!token) throw new Error("Aucun jeton d'authentification fourni.");

  const response = await axios.get(URL_APPLICATION, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.data
 },

async delete(id: number, token: string | null){
    if (!token) throw new Error("Aucun jeton d'authentification fourni.");
    await axios.delete(`${URL_APPLICATION}/${id}`,{
      headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
},



}