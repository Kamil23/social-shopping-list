import { prisma } from "@/lib/prisma";
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

export default async function deleteItem(
  req: QueryInterface,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { sessionId: id } = req.query;
    await prisma.item.delete({
      where: { id }
    });
    res.status(200).json({ code: 200, status: "Item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ code: 500, status: "Problem with deleting item" });
    console.error('Error deleting item: ', error);
  }
}
