import { Resource} from "@/types";
import axios from "axios";

export const  getResources=async()=>{
    try {
        const response = await axios.get('http://localhost:4000/resources');
        return response.data;
    } catch (error) {
        console.error("Erreur dans getEmploye:", error);
        return [];
    }

}
export const addResource=async(resource:Resource)=>{

    try{let res=axios.post('http://localhost:4000/resources',resource);

    }catch(error){
        console.error('Error adding resource:', error);
        throw error;
    }

}
export const deleteResource=async(id:string|undefined)=>{
    try{
        let res=axios.delete(`http://localhost:4000/resources/${id}`);
    }catch(error){
        console.error('Error deleting resource:', error);
        throw error;
    }

}
export const updateResource=async(resId:string,resData:any)=>{
    try{
        axios.patch(`http://localhost:4000/resources/${resId}`,resData);

    }catch(error){
        console.error('Error updating resources:', error);
        throw error;
    }

}