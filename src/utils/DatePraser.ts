export const getReadableDate = (date: Date) => {
  if (!date) {
    return "";
  }
  const dt = new Date(date);
  return dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear();
};
