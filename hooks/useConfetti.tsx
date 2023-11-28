import React, { createContext, useState, useMemo, useContext } from "react";

export const ConfettiContext = createContext(null);

export const ConfettiProvider = ({ children }) => {
  const [triggered, setTriggered] = useState(false);

  const memoizedValue = useMemo(
    () => ({
      triggered,
      setTriggered,
    }),
    [triggered, setTriggered]
  );

  return <ConfettiContext.Provider value={memoizedValue}>{children}</ConfettiContext.Provider>;
};

export default function useConfetti() {
  return useContext(ConfettiContext);
}
