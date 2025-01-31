"use client";

import { Button } from "@/components/ui/button";
import Collection from "@/components/ui/shared/collection";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getEventsByCreator, getEventsByUser } from "@/lib/actions/event";
import { Event } from "@/types";

const Page = () => {
  const { userId } = useAuth(); // Get userId from Clerk
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [memberEvents, setMemberEvents] = useState<Event[]>([]); // Store events organized by the user
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [page, setPage] = useState<number>(1); // Pagination (default to page 1)
  const fetchEvents = async () => {
    if (!userId) return; // Ensure userId is available
    try {
      setLoading(true); // Start loading
      const events = await getEventsByUser(userId.trim(), page); 
     const list=await getEventsByCreator(userId.trim(), page);
      setMemberEvents(events || []); 
      setOrganizedEvents(list || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setMemberEvents([]); // Fallback to empty state
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {

    fetchEvents();
  }, [userId, page]);

  return (
    <>
      {/* My Tickets Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10  dark:bg-black dark:text-white">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/">Explore More Events</Link>
          </Button>
        </div>
      </section>
        {/* Events Collection */}
        <section className="wrapper my-8 dark:bg-black">
        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : (
          <Collection
            data={memberEvents}
            emptyTitle="No event tickets purchased yet"
            emptyStateSubtext="No worries - plenty of exciting events to explore!"
            collectionType="Events_Organized"
            limit={6}
            page={page}
            urlParamName="eventsPage"
            totalPages={6}
            member={true}
            admin={false}
            fetchEvents={fetchEvents}
          />
        )}
      </section>

      {/* Organized Events Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10  dark:bg-black dark:text-white">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/event/create">Create Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8 dark:bg-black">
        <Collection 
          data={organizedEvents}
          emptyTitle="No events have been created by you yet"
          emptyStateSubtext="Go create your own event"
          collectionType="My_Tickets"
          limit={3}
          page={page}
          urlParamName="ordersPage"
          totalPages={6}
          admin={true}
          member={false}
          fetchEvents={fetchEvents}
        />
      </section>

    
    </>
  );
};

export default Page;
