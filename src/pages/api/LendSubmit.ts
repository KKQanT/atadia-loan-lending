import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === 'POST') {
      return await createLendSubmit(req, res);
    }
    else {
      return res.status(405).json({ message:'method not allowed', success:false})
    }
}

async function createLendSubmit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  
  try {
    const newEntry = await prisma.lendSubmitV1.create({
      data : {
        discordId: body.discordId,
        walletAddress: body.walletAddress,
        pfpTokenAddress: body.pfpTokenAddress,
        twitterHandle: body.twitterHandle,
        loanPackage: body.loanPackage,
        userTimeZoneLong: body.userTimeZoneLong,
        userTimeZoneShort: body.userTimeZoneShort,
        pohsRecipant: body.pohsRecipant
      }
    });
    return res.status(200).json(newEntry);
  } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: 'Error creating data', success: false })
  }
}