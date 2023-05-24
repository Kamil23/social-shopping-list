// import { APIUrl } from "@/enum";
// import { useRouter } from "next/router";
// import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

// // create context
// export const ListContext = createContext(null);

// // create provider
// export const ListProvider = ({ children }: { children: ReactNode }) => {
//   const [sessionData, setSessionData] = useState(undefined);
//   const router = useRouter();
//   debugger;
//   //@ts-ignore
//   const sessionId = router?.query?.sessionId;
//   debugger;

//   const getSession = async () => {
//     try {
//       const options = {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         }
//       };
//       const response = await fetch(`${APIUrl.GetSession}/${sessionId}`, options);
//       const result = await response.json();
//       setSessionData(result);
//     } catch (error) {
//       console.error('Get items error: ', error);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       debugger;
//       await getSession();
//     })();
//   }, []);
  
//   const memoizedValue = useMemo(() => ({
//     sessionData, 
//     setSessionData
//   }), [sessionData, setSessionData]);
//   // @ts-ignore
//   return <ListContext.Provider value={memoizedValue}>{children}</ListContext.Provider>
// }

// // export created hook
// export default function useList() {
//   return useContext(ListContext);
// }