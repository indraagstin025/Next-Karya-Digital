import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "./schema";

const baseInput = {
  name: "Budi Pratama",
  email: "Budi@Example.com",
  service: "website",
  whatsapp: "0812 3456 7890",
  message: "Saya butuh website company profile untuk bisnis saya.",
};

describe("contactMessageSchema", () => {
  it("accepts a valid submission and normalizes the WhatsApp number", () => {
    const parsed = contactMessageSchema.safeParse(baseInput);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.whatsapp).toBe("081234567890");
      expect(parsed.data.email).toBe("budi@example.com");
    }
  });

  it("accepts the +62 format", () => {
    const parsed = contactMessageSchema.safeParse({
      ...baseInput,
      whatsapp: "+62 812-3456-7890",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.whatsapp).toBe("+6281234567890");
    }
  });

  it("rejects a missing WhatsApp number", () => {
    const withoutWhatsapp = Object.fromEntries(
      Object.entries(baseInput).filter(([key]) => key !== "whatsapp")
    );
    const parsed = contactMessageSchema.safeParse(withoutWhatsapp);

    expect(parsed.success).toBe(false);
  });

  it("rejects an invalid WhatsApp number", () => {
    const parsed = contactMessageSchema.safeParse({
      ...baseInput,
      whatsapp: "12345",
    });

    expect(parsed.success).toBe(false);
  });
});
