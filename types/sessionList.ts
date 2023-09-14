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
  isDisabled: boolean;
  sortOrder: number;
}

export type Nullable<NullableType> = NullableType | null | undefined;

export interface DraggableData {
  draggableId: string;
  mode: string;
  source: {};
  type: string;
}