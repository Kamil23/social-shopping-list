import { Item } from "@/types/sessionList";

export const sortBySortOrder = (a: Item, b: Item) => {
  //@ts-ignore
  const isDisabledComparison = a.isDisabled - b.isDisabled;
  if (isDisabledComparison === 0) {
    return a.sortOrder - b.sortOrder;
  }
  return isDisabledComparison;
};

export const scrollToBottomWithKeyboardAdjustment = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const keyboardHeight = 200;
  
  const adjustedScrollTop = Math.max(scrollHeight - windowHeight + keyboardHeight, 0);

  window.scrollBy({
    top: adjustedScrollTop - window.scrollY,
    behavior: "smooth",
  });
}
