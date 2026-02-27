import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@terrax.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMeNow123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
      role: "ADMIN",
    },
    create: {
      name: "Administrador",
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`Admin listo: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
