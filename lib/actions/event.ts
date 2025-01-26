

import { Event } from "@/types";
import axios from "axios";
export const changeEmployeStatus= async (event:any) => {
  try{
    let list = event.employees.split(',').map((emp:any) => emp.trim()); // Trim each employee ID
    for (let emp of list) {
      let employeResponse = await axios.get(`http://localhost:4000/employes/${emp}`);
      const employe = employeResponse.data; // Ensure you're accessing the correct data
      if(employe.status==='busy'){
        employe.busyUntil=event.dateF;
      }else{
        employe.status='busy';
        employe.busyUntil=event.dateF;
      }
      const response = await axios.patch(`http://localhost:4000/employes/${emp}`,employe);
      if (response.status === 201 || response.status === 200){
        alert("employe status changed succefully");
        return;
    }
  }
  }catch (error) {
    alert("error while changing employe status");
    return;
  }
}
export const verifyEmployeAvailability = async (event: any): Promise<boolean> => {
  try {
    if (!event.employees || event.employees.trim() === '') {
      return true; // No employees assigned, consider availability true
    } else {
      let list = event.employees.split(',').map((emp:any) => emp.trim()); // Trim each employee ID
      for (let emp of list) {
        let employeResponse = await axios.get(`http://localhost:4000/employes/${emp}`);
        const employe = employeResponse.data; // Ensure you're accessing the correct data


        const employeBusyDate = new Date(employe.busyUntil);
        const eventDate = new Date(event.dateD);

        // Validate date objects
        if (isNaN(employeBusyDate.getTime())) {
          console.error(`Invalid date for employe.busyUntil: ${employe.busyUntil}`);
          return false; // Return false if a date is invalid
        }
        if (isNaN(eventDate.getTime())) {
          console.error(`Invalid date for event.dateD: ${event.dateD}`);
          return false; // Return false if a date is invalid
        }

        // Check if the employee is busy
        if (employe.status === 'busy' && employeBusyDate > eventDate) {
          return false; // Return false if any employee is not available
        }
      }
      return true; // If no employee is busy, return true
    }
  } catch (error) {
    console.error('Error in verifyEmployeeAvailability:', error);
    return false; // Return false in case of an error
  }
};

export const getEventById = async (eventId:string) :Promise<Event| null> => {
  try {
    const response = await axios.get(`http://localhost:4000/event/${eventId}`);

    if (!response.data) {
   
     
      return null;
    }

    return response.data; // Return the event data as JSON
  } catch (error) {
    if (error) {
      // The API responded with a status code outside the 2xx range
      console.error("Error in getEventById:", {
   
      });
    } else {
      // Network or other Axios-related error
      console.error("Unexpected error in getEventById:", error);
    }

    return null; // Return null to signify failure
  }
};
 type eventProps = {
  query: string;
  category: string;
  page: number;
  limit: number;

};

export const getEvents = async ({ query="",category="", page, limit }: eventProps) => {
        try {
            let response
            if( query==="" && category===""){
              response = await axios.get("http://localhost:4000/event");
          }else{
                if(category===""){
                response = await axios.get(`http://localhost:4000/event/search/${query}/${page}/${limit}`);
                 }
                 else if(query===""){
                  response = await axios.post(`http://localhost:4000/event/category/${category}`);
                 }
                 else{
                  response = await axios.post(`http://localhost:4000/event/search/${query}/${category}/${page}/${limit}`);
                 }
                }
            let events = response?.data;
            return {
              data: Array.isArray(events) ? events : [events],
              totalPages: 1,};
            } catch (error) {
    console.error("Erreur dans getEvents :", error);
    return { data: [], totalPages: 0 };
  }
}

export const createEvent = async (data:Event) => {
  try {

      /*const response = await axios.post('https://example.com/api/events', data);
      return response.data;*/
  } catch (error) {
      console.error('Error adding event:', error);
      throw error;
  }
};
export const getCategories = async (): Promise<string[]>=> {
  try {
    const response = await axios.post('http://localhost:4000/event/categories');
    return response.data;
  } catch (error) {
    console.error("Erreur dans getCategories :", error);
    return [];
  }
}


export const deleteEvent = async (eventId: string|undefined): Promise<void> => {
  try {
  
    const response = await axios.delete(`http://localhost:4000/event/${eventId}`);
    fetchEvents();
   alert("event deleted succefully");
   return;
  } catch (error: any) {
    console.error('Problem while deleting the event:', error);
    console.error('Error response:', error.response);
    throw new Error(error?.response?.data?.message || 'Problem while deleting the event');
  }
};
/* */
export const inscription = async (userId:any,user:any, eventId:any) => {
  try {
    if (!userId || !eventId|| !user) {
      throw new Error("userId et eventId sont requis.");
    }


  
   let res= await axios.post(`http://localhost:4000/event/inscription/${eventId}/${userId}`);
   console.log(res.data);
   if(res.data=="eventexpired"){
    alert("event date expired ");
    return ;
   }
   else if(res.data=="seatscompleted"){
    alert("seats completed");
    return ;
   }
   else {
      alert("inscription success");
      return true;
     
    }

    throw new Error("Inscription échouée, statut inattendu.");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw new Error("Erreur lors de l'inscription.");
  }

  
};
export const getEventsByUser = async (userId: string | undefined, page: number): Promise<Event[] | []> => {
  try {

    const response = await axios.get(`http://localhost:4000/event/participant/${userId}`);
    return response.data; // Assuming the API returns an array of events in the response's `data`
  } catch (error) {
    console.error("Error while getting events by user:", error);
    return []; // Return an empty array in case of an error
  }
};
export const getEventsByCreator = async (creId: string | undefined, page: number): Promise<Event[] | []> => {
  try {

    const response = await axios.get(`http://localhost:4000/event/creator/${creId}`);
    return response.data; // Assuming the API returns an array of events in the response's `data`
  } catch (error) {
    console.error("Error while getting events by user:", error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchEvents = async () => {
  // Example fetch logic: You can replace this with your actual implementation

};