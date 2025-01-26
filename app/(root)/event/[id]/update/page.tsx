'use client';

import EventForm from "@/components/ui/shared/EventForm";
import { useAuth } from "@clerk/nextjs";
import { useParams } from 'next/navigation';

const UpdateEvent = () => {
  const { userId } = useAuth(); 
  let sId=userId?.trim();
  const { id } = useParams();
if(sId)
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 flex justify-center items-center text-center">
        <h1>create event</h1>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={sId} type="update" id={id as string} />
      </div>
    </>
  );
  else{
    return<h1>you need to login to update event</h1>
  }
};

export default UpdateEvent;
