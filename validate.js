// Validation helpers — ES module.

export function validateEmail(val) {
  if (!val || !val.trim()) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
    ? null
    : "Enter a valid email address";
}

export function validatePhone(val) {
  if (!val || !val.trim()) return null;
  let d = val.replace(/[\s\-.()+]/g, "");
  if (d.startsWith("91") && d.length > 10) d = d.slice(2);
  return /^[6-9]\d{9}$/.test(d) ? null : "Enter a valid 10-digit mobile number";
}
