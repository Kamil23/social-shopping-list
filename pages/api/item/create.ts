import { prisma } from "@/lib/prisma";
import { UUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  code: number;
  status: string;
};

interface RequestBody {
  id: UUID;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  sessionId: UUID;
  isDisabled: boolean;
}

export default async function createItem(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const requestData: RequestBody = req.body;
    const { id, title, createdAt, updatedAt, sessionId, isDisabled } =
      requestData;
    await prisma.item.create({
      data: {
        id,
        title,
        createdAt,
        updatedAt,
        sessionId,
        isDisabled,
      },
    });
    res.status(201).json({ code: 201, status: "Item created successfully!" });
  } catch (error) {
    console.error('Error creating item: ', error);
  }
}
