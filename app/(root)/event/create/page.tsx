'use client';

import EventForm from "@/components/ui/shared/EventForm";
import { useAuth } from "@clerk/nextjs";

const CreateEvent = () => {
  const { userId } = useAuth(); 
 let sId=userId?.trim();
if(sId)
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 flex justify-center items-center text-center">
        <h1>create event</h1>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={sId} type="create"/>
      </div>
    </>
  );
  else{
    return<h1>you need to login to create  event</h1>
  }
};

export default CreateEvent;
