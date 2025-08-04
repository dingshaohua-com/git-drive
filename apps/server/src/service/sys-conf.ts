import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
export const queryOne = async () => {
  const results: any = await prisma.sys_conf.findFirst();
  return results;
};