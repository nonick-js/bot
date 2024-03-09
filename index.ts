import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.guild.create({
    data: {
        guildId: '1234567890',
    }
  });
  console.log('success')
}

main();