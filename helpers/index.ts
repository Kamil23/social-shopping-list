import { Item } from "@/types/sessionList";
import { TimeInMilliseconds } from "@/enum";

export const sortByUpdatedAtAndIsDisabled = (a: Item, b: Item) => {
  // @ts-ignore
  const isDisabledComparison = a.isDisabled - b.isDisabled;
  return isDisabledComparison;
};

export const formatDate = (itemDateString: string) => {
  const nowUnix = new Date().getTime();
  const itemDateUnix = new Date(itemDateString).getTime();

  if (nowUnix - itemDateUnix <= TimeInMilliseconds.OneDay) {
    return new Date(itemDateString).toLocaleTimeString().slice(0, -3);
  }
  return new Date(itemDateString).toLocaleDateString();
};