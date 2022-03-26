import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === 'POST') {
      return await createVerifyWallet(req, res);
    }
    else {
      return res.status(405).json({ message:'method not allowed', success:false})
    }
}

async function createVerifyWallet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  
  try {
    const newEntry = await prisma.verifyWalletV1.create({
      data: {
        discordId: body.discordId,
        walletAddress: body.walletAddress,
        discordUsername: body.discordUsername,
        discordDiscriminator: body.discordDiscriminator,
        discordEmail: body.discordEmail,
        discordLocale: body.discordLocale,
        discordPremiumType: body.discordPremiumType,
        discordFlag: body.discordFlag,
        discordPublicFlag: body.discordPublicFlag,
        discortMfaEnable: body.discortMfaEnable,
        joinedServerId: body.joinedServerId,
        joinedServerName : body.joinedServerName
      }
    });
    return res.status(200).json(newEntry); //success : true?????????
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: 'Error creating data', success: false });
  }
}