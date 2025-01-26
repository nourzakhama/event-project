export const headerLinks = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'event',
    route: '/event/create',
  },
  {
    label: 'admin',
    route: '/admin',
  },
  {
    label: 'dashboard',
    route: '/dashboard',
  },
  {
    label: 'profile',
    route: '/profile',
  } ,
]
export const UheaderLinks = [
  {
    label: 'Home',
    route: '/',

  },
  {
    label: 'profile',
    route: '/profile',
  } ,
  {
    label: 'event',
    route: '/event/create',
  },

 
]
export const DheaderLinks = [
  {
    label: 'participants',
    route: '/participants',
  },
  {
    label: 'employes',
    route: '/employes',
  },
  {
    label: 'resources',
    route: '/resources',
  }
]




const eventDefaultValues = {
  id: undefined, //added id field
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  dateD: new Date(), // renamed
  dateF: new Date(), // renamed
  category: '',
  price: 0,
  isFree: false,
  url: '',
  status:'en attente',
  participants: [], // changed to empty array
  employees: [],    // changed to empty array
  resources: []     // changed to empty array
};

