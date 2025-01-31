





export type GetAllEventsParams = {
  query: string
  category: string
  limit: number
  page: number
}

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export type Event = {
  id?: string;
  title?: string;
  category?: string;
  description?: string;
  prix?: string;
  imageUrl?: string;
  location?: string;
  dateD: Date; // Start date (required)
  dateF: Date; // End date (required)
  url?: string;
  capacity?: string;
  creatorId?: string;
  participants?: string;
  employees?: string;
  resources?: string;
  status?: string;
};

export type Participant = {
  id?:string
  cin?: string;
  email: string;
  name?: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl?: string;
  satisfaction?:string
};
export type Employe={
  id?:string
  name?:string
  role?:string
  status?:string
  busyUntil?:Date
}
export type Resource={
  id?:string
  name?:string
  quantity?:number
  status?:string
  busyUntil?:Date
}
export type Order= {
  stripeId?: string | undefined;
  eventTitle?: string | undefined;
  eventId: string | undefined;
  price: number;
  buyerId: string | null | undefined;
  createdAt?: Date;
}



export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export type updateParamProps = {
  params: { id: string }
 
}


