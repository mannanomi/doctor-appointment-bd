"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";

export type FormState = { error: string; values?: Record<string, string> } | undefined;

const BD_PHONE_RE = /^(\+8801|01)[3-9]\d{8}$/;

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const values = { name, email, phone };

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required.", values };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", values };
  }
  if (phone && !BD_PHONE_RE.test(phone)) {
    return { error: "Enter a valid Bangladeshi phone number, e.g. 01712345678.", values };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists.", values };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/appointments" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Could not sign in after registration." };
    }
    throw error;
  }
  return undefined;
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/appointments" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password.", values: { email } };
    }
    throw error;
  }
  return undefined;
}

export async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export async function bookAppointmentAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to book an appointment." };
  }

  const doctorId = String(formData.get("doctorId") ?? "");
  const timeSlotId = String(formData.get("timeSlotId") ?? "");
  if (!doctorId || !timeSlotId) {
    return { error: "Please choose a date and time." };
  }

  const slot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: { appointments: { where: { status: "confirmed" } } },
  });
  if (!slot) {
    return { error: "That time slot no longer exists." };
  }
  if (slot.appointments.length > 0) {
    return { error: "That time slot has just been booked. Pick another." };
  }

  await prisma.appointment.create({
    data: {
      userId: session.user.id,
      doctorId,
      timeSlotId,
    },
  });

  revalidatePath("/appointments");
  revalidatePath("/my-appointments");
  redirect(`/my-appointments?booked=1`);
}

export async function cancelAppointmentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const appointmentId = String(formData.get("appointmentId") ?? "");
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment || appointment.userId !== session.user.id) return;

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "cancelled" },
  });

  revalidatePath("/my-appointments");
}
