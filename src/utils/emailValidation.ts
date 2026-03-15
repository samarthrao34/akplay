// Email validation - checks for valid format with real domain patterns
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email) || email.includes("..")) return false;
  // Block obviously fake domains
  const domain = email.split("@")[1].toLowerCase();
  const blockedPatterns = ["test.com", "fake.com", "example.com", "asdf.com", "abc.com", "xyz.xyz"];
  if (blockedPatterns.includes(domain)) return false;
  // Must have valid TLD
  const tld = domain.split(".").pop() || "";
  if (tld.length < 2) return false;
  return true;
}
