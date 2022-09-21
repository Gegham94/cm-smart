export const weekDaysGenerator = (date: Date) => {
  date = new Date(date);
  return Array(6)
    .fill(date)
    .map((el, idx) => {
      return new Date(el.setDate(el.getDate() - el.getDay() + idx + 1));
    });
};
