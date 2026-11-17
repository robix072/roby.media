import { z } from "zod";

export const BUDGETS = ["sub-1000", "1000-3000", "3000-6000", "6000-10000", "peste-10000", "nu-stiu"] as const;

/** Validarea formularului de contact (folosită și în browser, și pe server). */
export const ContactSchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "name"),
  company: z.string().trim().max(150).optional().default(""),
  phone: z
    .string()
    .trim()
    .max(30, "phone")
    .regex(/^[+()\d\s./-]{9,}$/, "phone")
    .refine((v) => v.replace(/\D/g, "").length >= 9, "phone"),
  email: z.string().trim().max(150, "email").email("email"),
  service: z.string().trim().max(80).optional().default(""),
  budget: z.union([z.enum(BUDGETS), z.literal("")]).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(3000, "message").optional().default(""),
  gdpr: z.literal(true, { message: "gdpr" }),
  // Anti-spam
  website: z.string().max(500).optional().default(""), // honeypot: dacă e completat, serverul ignoră mesajul
  startedAt: z.number().optional(),
  // Context
  locale: z.enum(["ro", "en"]).default("ro"),
  sourcePage: z.string().max(300).optional().default(""),
});

export type ContactInput = z.input<typeof ContactSchema>;
