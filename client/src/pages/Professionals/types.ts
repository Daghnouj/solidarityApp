export interface Service {
  _id?: string;
  name: string;
  price?: string;
  duration?: string;
}

export interface Professional {
  _id: string;
  nom: string;
  specialite: string;
  adresse: string;
  photo?: string;
  email?: string;
  telephone?: string;
  bio?: string;
  services?: Service[];
}

export interface FiltersState {
  specialty: string;
  location: string;
  search: string;
}

export interface FilterOptions {
  specialties: string[];
  locations: string[];
}
