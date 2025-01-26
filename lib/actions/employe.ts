import { Employe, Participant } from "@/types";
import axios from "axios";

export const  getEmployes=async()=>{
    try {
        const response = await axios.get('http://localhost:4000/employes');
        return response.data;
    } catch (error) {
        console.error("Erreur dans getEmploye:", error);
        return [];
    }

}
export const addEmploye=async(employe:Employe)=>{

    try{let res=axios.post('http://localhost:4000/employes',employe);

    }catch(error){
        console.error('Error adding employe:', error);
        throw error;
    }

}
export const deleteEmploye=async(id:string|undefined)=>{
    try{
        let res=axios.delete(`http://localhost:4000/employes/${id}`);
    }catch(error){
        console.error('Error deleting employe:', error);
        throw error;
    }

}
export const updateEmploye=async(empId:string,empData:any)=>{
    try{
        axios.patch(`http://localhost:4000/employes/${empId}`,empData);

    }catch(error){
        console.error('Error updating employe:', error);
        throw error;
    }

}