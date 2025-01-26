'use client'
import { useState,useCallback , useEffect } from "react";
import Collection from "@/components/ui/shared/collection";
import { getEvents } from "@/lib/actions/event";
import Search from "@/components/ui/shared/search";
import { Event } from "@/types";

import { SearchParamProps } from "@/types";
const Admin = ({searchParams}:SearchParamProps) => {
    const page = Number(searchParams?.page) || 1;
    const searchText = (searchParams?.query as string) || '';

  
  
  const [events, setEvents] = useState<Event[]>([]); // State to store events
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch events
    const  fetchEvents = useCallback(async () => {
    try {
      let searchText="";
      let category="";
      let page=1;
      let limit=6;

      setLoading(true); // Start loading before the fetch
      let res = await getEvents({query:searchText,category:category,page:page,limit:6}); // Fetch events

      setEvents(res.data); // Update the events state
      setError(null); // Clear any previous errors
    } catch (error) {
     console.log('error') // Set error message
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  }, []);

  useEffect(() => {

    fetchEvents(); 

  }, [fetchEvents]); 

  // Handle loading state
  if (loading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>{error}</p>;

  return (
    <>
    <div>
 
      <Collection
        data={events|| []}
        emptyTitle="No Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={0}
        page={0}
        totalPages={6}
        admin={true}
        member={false}
        fetchEvents={fetchEvents}
        

      />
      </div>
    </>
  );
};

export default Admin;