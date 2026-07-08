import {prismaClient} from '@prisma/client';

const prsima = new prismaClient();

async function main() {
    // 목 데이터 삽입
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });