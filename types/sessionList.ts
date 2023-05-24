export interface SessionData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: Item[];
}

export interface Item {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}