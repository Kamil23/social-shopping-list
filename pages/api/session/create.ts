import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  code: number;
  status: string;
  data: {
    sessionId: string;
  };
};

export default async function createSession(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const now = new Date().toISOString();
  const sessionId = crypto.randomUUID();
  await prisma.session.create({
    data: {
      id: sessionId,
      createdAt: now,
      updatedAt: now,
    },
  });
  res.status(201).json({
    code: 201,
    status: "New Session created successfully!",
    data: {
      sessionId,
    },
  });
}
