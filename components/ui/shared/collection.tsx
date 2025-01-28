


import { Event } from '@/types';
import React from 'react';
import Card from './card';
import Link from 'next/link';

type CollectionProps = {
  data: Event[] ,
  emptyTitle: string,
  emptyStateSubtext: string,
  limit: number,
  page: number | string,
  totalPages?: number,
  urlParamName?: string,
  collectionType?: 'Events_Organized' | 'My_Tickets' | 'All_Events',
  admin:boolean,
  member:boolean,
  fetchEvents:()=>void
}

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
  admin,
  member,
  fetchEvents
}: CollectionProps) => {


  


  return (
    <>
      {data.length > 0 ? (
        <div className="flex  justify-center gap-10">
          <ul className="grid w-full grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((item) => {
           

              return (
                <li key={item.id} className="flex  items-center justify-center">
                  {/* Carte de l'événement */}
                  <Card fetchEvents={fetchEvents} member={member} admin={admin} event={item}    />

                  {/* Bouton conditionnel basé sur l'authentification */}
                
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        // Affiche un état vide si aucune donnée n'est trouvée
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] alert alert-primary bg-grey-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold ">{emptyTitle}</h3>
          <p className="p-regular-14 alert-primary">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
}

export default Collection;
