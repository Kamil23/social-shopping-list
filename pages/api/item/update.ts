import { prisma } from "@/lib/prisma";
import { UUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  code: number;
  status: string;
};

interface RequestBody {
  id: UUID;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sessionId?: UUID;
  isDisabled?: boolean;
}

export default async function updateItem(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const requestData: RequestBody = req.body;
    const { id } = requestData;
    await prisma.item.update({
      where: { id },
      data: {
        ...requestData,
      },
    });
    res.status(201).json({ code: 201, status: "Item updated successfully!" });
  } catch (error) {
    res.status(500).json({ code: 500, status: "Problem with updating item" });
    console.error('Error updating item: ', error);
  }
}
