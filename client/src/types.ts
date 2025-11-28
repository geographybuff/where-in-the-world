export interface FamilyMember {
  value: string;
  label: string;
}

export const FAMILY_MEMBERS: FamilyMember[] = [
  { value: 'alan', label: 'Alan' },
  { value: 'deborah', label: 'Deborah' },
  { value: 'john', label: 'John' },
  { value: 'cyn', label: 'Cyn' },
  { value: 'louise', label: 'Louise' },
  { value: 'ben', label: 'Ben' },
  { value: 'michelle', label: 'Michelle' },
];

export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  familyMembers: string[];
  postcardUrl?: string;
  createdAt: string;
}

export interface LocationInput {
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  familyMembers: string[];
  postcard?: File;
}

export interface FilterState {
  familyMembers: string[];
  startDate: Date | null;
  endDate: Date | null;
  searchText: string;
}
