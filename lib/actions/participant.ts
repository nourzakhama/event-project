import { Participant } from "@/types";
import axios from "axios";

export const getParticipants = async () => {
    try {
        const response = await axios.get('http://localhost:4000/participants');
        return response.data;
    } catch (error) {
        console.error("Erreur dans getParticipants :", error);
        return [];
    }

}

export const deleteParticipant = async (id: string | undefined) => {
    try {
        let res = axios.delete(`http://localhost:4000/participants/${id}`);
    } catch (error) {
        console.error('Error deleting participant:', error);
        throw error;
    }

}
export const updateParticipant = async (partId: string, PartData: any) => {
    try {
        axios.patch(`http://localhost:4000/participants/${partId}`, PartData);

    } catch (error) {
        console.error('Error updating participant:', error);
        throw error;
    }

}
export const addParticipant = async (participant: Participant) => {
    console.log(participant);
    try {
        let res = axios.post('http://localhost:4000/participants', participant);

    } catch (error) {
        console.error('Error adding participant:', error);
        throw error;
    }

}