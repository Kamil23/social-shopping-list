import { prisma } from "@/lib/prisma";
import { Item } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  code: number;
  status: string;
};

interface QueryInterface extends NextApiRequest {
  query: {
    sessionId: string;
  };
}

export default async function updateSession(
  req: QueryInterface,
  res: NextApiResponse<ResponseData>
) {
  try {
    const now = new Date();
    const { sessionId: id } = req.query;
    console.log("sessionid: ", id);
    const data = req.body;
    console.log("session data to update: ", JSON.stringify(data));
    if (!id) {
      throw new Error("no session id");
    }

    const itemsUpdateData = data.map((item: Item) => ({
      where: { id: item.id },
      data: {
        title: item.title,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isDisabled: item.isDisabled,
        sortOrder: item.sortOrder,
      },
    }));

    await prisma.session.update({
      where: { id },
      data: {
        updatedAt: now,
        items: {
          updateMany: itemsUpdateData,
        },
      },
    });
    
    res
      .status(201)
      .json({ code: 200, status: "Session updated successfully!" });
  } catch (error) {
    console.error(error);
  }
}
