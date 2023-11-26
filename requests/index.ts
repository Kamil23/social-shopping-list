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
  } catch (error) {
    console.error("Problem with create session", error);
  }
};


export const updateSession = async (dataToUpdate: any, sessionId: string | string[] | undefined) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    };
    await fetch(`${APIUrl.UpdateSession}/${sessionId}`, options);
  } catch (error) {
    console.error("Problem with update session data", error);
  }
}

export const deleteItem = async (sessionId: string | string[] | undefined) => {
  try {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    };
    await fetch(`${APIUrl.DeleteItem}/${sessionId}`, options);
  } catch (error) {
    console.error("Problem with update session data", error);
  }
}

export const updateSessionName = async (dataToUpdate: any, sessionId: string | string[] | undefined) => {
  try {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    };
    await fetch(`${APIUrl.UpdateSessionName}/${sessionId}`, options);
  } catch (error) {
    console.error("Problem with update session data", error);
  }
}

