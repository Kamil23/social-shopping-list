import { Item } from "@/types/sessionList";

export const sortByUpdatedAtAndIsDisabled = (a: Item, b: Item) => {
  //@ts-ignore
  const isDisabledComparison = a.isDisabled - b.isDisabled;
  if (isDisabledComparison === 0) {
    return b.updatedAt.localeCompare(a.updatedAt);
  }
  return isDisabledComparison;
};