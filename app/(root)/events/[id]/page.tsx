"use client";
import { Event } from "@/types";
import { SignedOut, useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getEventById, inscription } from "@/lib/actions/event";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';
const DetailEvent = ({ params: { id } }: SearchParamProps) => {
  const { userId } = useAuth(); // Fetch user ID from Clerk
  const { user } = useUser();
  const [event, setEvent] = useState<Event | null>(null); // State to store event details
  const [loading, setLoading] = useState(true);

  const handleInscription = async () => {
    await inscription(userId, user, event?.id);
    return;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent: Event = await getEventById(id) as unknown as Event; // Explicitly define the type here
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          alert("Event not found");
        }
      } catch (error) {
        alert("Error fetching event:");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  }

  if (!event) {
    return <p className="text-center mt-20 text-red-500">Event not found.</p>;
  }

  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-10 px-5">
      <div className="flex flex-col w-full max-w-5xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Event Image */}
        <div className="w-full h-[300px] md:h-[500px] relative">
          <Image
            src={event.imageUrl || "/assets/images/event.png"}
            alt={event.title || "Event Image"}
            width={1200}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Content */}
        <div className="p-8 md:p-12">
          {/* Event Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {event.title || "Event Title"}
          </h1>

          {/* Event Details */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {!event.prix ? "Free" : `$${event.prix}`}
            </span>
            <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              {!event.capacity ? "Unbounded" : `${event.capacity} Seats`}
            </span>
            <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              {event.category || "Category"}
            </span>
          </div>

          {/* Dates and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <Image src="/assets/icons/calendar.svg" alt="calendar" width={24} height={24} />
              <p className="text-lg text-gray-600">
                <strong>Start:</strong>{" "}
                <span className="text-gray-800">{formatDateTime(event.dateD).dateOnly || "N/A"}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/assets/icons/calendar.svg" alt="calendar" width={24} height={24} />
              <p className="text-lg text-gray-600">
                <strong>End:</strong>{" "}
                <span className="text-gray-800">{formatDateTime(event.dateF).dateOnly || "N/A"}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/assets/icons/location.svg" alt="location" width={24} height={24} />
              <p className="text-lg text-gray-600">
                <strong>Location:</strong>{" "}
                <span className="text-gray-800">{event.location || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Creator ID */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Creator:</h2>
            <p className="text-gray-700">{event.creatorId || "Creator ID not available."}</p>
          </div>

          {/* Event Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">What You'll Learn:</h2>
            <p className="text-gray-700">{event.description || "No description available."}</p>
          </div>

          {/* External Link */}
          {event.url && (
            <div className="mb-8">
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-lg underline"
              >
                Learn More
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            {userId ? (
              <Button onClick={handleInscription} size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Inscription to Event
              </Button>
            ) : (<div className="flex justify-center gap-6">
              <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-gray-700">
                <Link href="/">Return Home</Link>
              </Button>
              <SignedOut>
                <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                </SignedOut>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailEvent;
