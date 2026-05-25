import axios from "axios";

const URL_APPLICATION = import.meta.env.VITE_APPLICATION_API;
const URL_MEMO = import.meta.env.VITE_MEMOS_NOTES;

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



//Pour les notes
async getAllNotes(token: string | null){
  if (!token) throw new Error("Aucun jeton d'authentification fourni.");

  const response = await axios.get(URL_MEMO, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.data
 },

 async addNotes(note: any, token: string | null){
  if (!token) throw new Error("Aucun jeton d'authentification fourni.");

  const response = await axios.post(URL_MEMO, note, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.data
 },

async UpdateNotes(id: number, note: any, token: string | null){
  if (!token) throw new Error("Aucun jeton d'authentification fourni.");

  const response = await axios.put(`${URL_MEMO}/${id}`, note, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.data
},

async deleteNotes(id: number, token: string | null){
    if (!token) throw new Error("Aucun jeton d'authentification fourni.");
    await axios.delete(`${URL_MEMO}/${id}`,{
      headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
},


}
