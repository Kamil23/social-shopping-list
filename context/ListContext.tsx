import { SessionData } from "@/types/sessionList";
import { createContext, useMemo, useState } from "react";

interface ListContextProps {
  sessionData: SessionData;
  setSessionData: (data: SessionData) => void;
  saveData: (data: SessionData) => void;
}

export const ListContext = createContext<ListContextProps>({} as ListContextProps);

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData>([] as unknown as SessionData);

  const saveData = (data: SessionData) => {
    setSessionData(data);
  };

  const memoizedValue = useMemo(() => {
    return { sessionData, setSessionData, saveData };
  }, [sessionData]);

  return (
    <ListContext.Provider value={memoizedValue}>
      {children}
    </ListContext.Provider>
  );
};

export default ListProvider;
