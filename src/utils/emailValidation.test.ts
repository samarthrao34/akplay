import { expect, test, describe } from "bun:test";
import { isValidEmail } from "./emailValidation";

describe("isValidEmail", () => {
  test("should accept valid email formats", () => {
    expect(isValidEmail("test@gmail.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("user+alias@sub.domain.com")).toBe(true);
    expect(isValidEmail("123@abc.de")).toBe(true);
  });

  test("should reject malformed email addresses", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@domain")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
    expect(isValidEmail("user@domain..com")).toBe(false);
  });

  test("should reject blocked domains", () => {
    const blockedDomains = ["test.com", "fake.com", "example.com", "asdf.com", "abc.com", "xyz.xyz"];
    blockedDomains.forEach(domain => {
      expect(isValidEmail(`user@${domain}`)).toBe(false);
      expect(isValidEmail(`user@${domain.toUpperCase()}`)).toBe(false);
    });
  });

  test("should enforce TLD length requirements", () => {
    expect(isValidEmail("user@domain.c")).toBe(false);
    expect(isValidEmail("user@domain.ca")).toBe(true);
    expect(isValidEmail("user@domain.com")).toBe(true);
    expect(isValidEmail("user@domain.info")).toBe(true);
  });

  test("should handle case sensitivity in domains", () => {
    expect(isValidEmail("USER@GMAIL.COM")).toBe(true);
    expect(isValidEmail("user@TEST.COM")).toBe(false);
  });
});
