import { prisma } from "@/lib/prisma";
import { Item } from "@/types/sessionList";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  code: number;
  status: string;
  data: {
    sessionData: Item[];
  };
};

export default async function getSession(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { sessionId: id } = req.query;
  const sessionData = await prisma.session.findUnique({
    //@ts-ignore
    where: { id },
    include: {
      items: true,
    },
  });
  res.status(200).json({
    code: 200,
    status: "Session found",
    data: {
      //@ts-ignore
      sessionData,
    },
  });
}
