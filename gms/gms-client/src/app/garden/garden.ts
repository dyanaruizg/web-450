export interface Garden {
  _id: string;
  gardenId: number;
  name: string;
  location: string;
  description?: string;
  dateCreated?: string;
  dateModified?: string;
}

export type UpdateGardenDTO = Omit<Garden, '_id' | 'gardenId' | 'dateCreated' | 'dateModified'>;

export type AddGardenDTO = Omit<Garden, '_id' | 'gardenId' | 'dateModified'>;
