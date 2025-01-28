import { Event } from "@/types";
import Link from "next/link";
import { formatDateTime } from '@/lib/utils'
import Image from "next/image";
import { Check, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import  CheckOutButton  from "@/components/ui/shared/CheckOutButton";

import {DeleteConfirmation} from "@/components/deleteConfirmation";
type props={
    event:Event,
    admin:boolean,
    member:boolean,
    fetchEvents:()=>void


}
const Card = ({ event, admin,member, fetchEvents }: props) => {
  return (
    <div className="group relative flex flex-col min-h-[600px] w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl md:min-h-[450px]">
      {/* Event Image */}
      <Link
        href={`/events/${event.id}`}
        style={{
          backgroundImage: `url(${event.imageUrl ? event.imageUrl : '/assets/images/event.png'})`,
        }}
        className="h-[200px] flex-center bg-gray-100 bg-cover bg-center"
      />

      {/* Event Content */}
      <div className="flex flex-col gap-4 p-6">
        {/* Event Info Badges */}
        <div className="flex gap-3 items-center flex-wrap">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
            {!event.prix ? 'FREE' : `$${event.prix}`}
          </span>
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {!event.capacity ? 'Unbounded' : `${event.capacity} seats`}
          </span>
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {event.category}
          </span>
          {admin && (
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              {event.status}
            </span>
          )}
        </div>

        {/* Event Dates */}
        <div className="text-sm text-gray-700">
          <p>
            <strong>Start Date:</strong> {formatDateTime(event.dateD).dateTime}
          </p>
          <p>
            <strong>End Date:</strong> {formatDateTime(event.dateF).dateTime}
          </p>
        </div>

        {/* Event Title */}
        <Link href={`/events/${event.id}`} className="text-lg font-semibold text-gray-800 hover:underline">
          {event.title}
        </Link>
{ member && <CheckOutButton event={event}  />}
        {/* Admin Additional Info */}
        {admin && event && (
          <div className="mt-4 text-sm text-gray-700">
            <p>
              <strong>Employees:</strong> {event.employees}
            </p>
            <p>
              <strong>Resources:</strong> {event.resources}
            </p>
            <p>
              <strong>Participants:</strong> {event.participants}
            </p>
          </div>
        )}

        {admin && (
          <p className="text-sm text-gray-700">
            <strong>Creator ID:</strong> {event.creatorId}
          </p>
        )}

        {/* Admin Actions */}
        {admin && (
          <div className="flex items-center justify-between mt-6">
            <Button
              asChild
              className="rounded-full bg-blue-600 px-6 py-2 text-sm text-white transition-all duration-300 hover:bg-blue-700"
            >
              <Link href={`/event/${event.id}/update`}>Update</Link>
            </Button>
            <DeleteConfirmation fetchEvents={fetchEvents} eventId={event.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
