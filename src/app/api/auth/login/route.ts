import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { AUTH_COOKIE, signSessionToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ message: "Usuario no autorizado" }, { status: 401 });
  }

  const validPassword = await compare(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ message: "Usuario o clave incorrectos" }, { status: 401 });
  }

  const token = await signSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

