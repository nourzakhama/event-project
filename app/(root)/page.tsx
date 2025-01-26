import React from "react";
import { Button } from "@/components/ui/button";
import Collection from "@/components/ui/shared/collection";
import { getEvents } from "@/lib/actions/event";
import Image from "next/image";
import Link from "next/link";
import Search from "@/components/ui/shared/search";
import { SearchParamProps } from "@/types";
import CategoryFilter from "@/components/ui/shared/CategoryFilter";
import { get } from "http";



const Home=async({ searchParams }: SearchParamProps)=>{
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  let events = await getEvents({ query: searchText, category, page, limit: 6 });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-10 md:py-16">
        <div className="wrapper grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Hero Content */}
          <div className="flex flex-col justify-center gap-6 text-center md:text-left">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Explore, Book, and Create Events Worldwide!
            </h1>
            <p className="text-lg text-gray-600 md:text-xl">
              Discover and book exciting events worldwide, or create and host
              your own on our platform. Join a vibrant community to connect with
              others who share your passion for unforgettable experiences!
            </p>
            <Button size="lg" asChild className="w-full sm:w-fit">
              <Link href="#events">Explore Events</Link>
            </Button>
          </div>

          {/* Hero Image */}
          <div className="flex items-center justify-center">
            <Image
              src="/assets/images/pf2.png"
              alt="Event showcase"
              width={800}
              height={800}
              className="max-h-[60vh] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="wrapper py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Trusted by Thousands of Events
        </h2>

        {/* Filters */}
        <div className="flex flex-col gap-5 md:flex-row mb-8">
          <Search />
          <CategoryFilter />
        </div>

        {/* Collection */}
        <Collection
          data={events?.data || []}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages || 0}
          admin={false}
          member={false}
          fetchEvents={()=>{}}
        />
      </section>
    </>
  );
}
export default Home;