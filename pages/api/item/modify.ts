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

export default async function modifyItem(
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
    res.status(201).json({ code: 201, status: "Item modified successfully!" });
  } catch (error) {
    console.error('Error updating item: ', error);
  }
}
