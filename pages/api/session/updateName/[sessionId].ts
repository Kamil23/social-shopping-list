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

export default async function updateSessionName(
  req: QueryInterface,
  res: NextApiResponse<ResponseData>
) {
  try {
    const now = new Date();
    const { sessionId: id } = req.query;
    const data = req.body;
    if (!id) {
      throw new Error("no session id");
    }

    const nameForUpdate = data.name;

    if (!nameForUpdate) {
      throw new Error("no name for update");
    }

    await prisma.session.update({
      where: { id },
      data: {
        updatedAt: now,
        name: nameForUpdate,
      },
    });

    res
      .status(200)
      .json({ code: 200, status: "Session name updated successfully!" });
  } catch (error) {
    console.error(error);
  }
}
