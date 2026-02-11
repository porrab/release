export const formatDate = (d?: string) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString();
  } catch {
    return "d";
  }
};
