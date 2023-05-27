import { APIUrl } from "@/enum";

export const createSession = async () => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(APIUrl.CreateSession, options);
    const {
      data: { sessionId },
    } = await response.json();
    return sessionId;
  } catch (error) {}
};