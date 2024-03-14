import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.guild
    .create({
      data: {
        guildId: '1234567890',
      },
    })
    .catch(() => null);
  await prisma.auditLog.create({
    data: {
      guildId: '1234567890',
      author: '735110742222831657',
      after: { name: 'NoNICK' },
      before: { name: 'NULL' },
    },
  });
  console.log('success');
  const data = await prisma.guild.findMany({
    where: { guildId: '1234567890' },
    include: { auditLogs: true },
  });
  console.info(data);
}

main();
