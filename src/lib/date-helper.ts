export const dateToUTCDate = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};

export const handleFormatDate = (date: Date): Date => {
  const formattedDate = new Date(date);
  formattedDate.setHours(0, 0, 0, 0);
  return formattedDate;
};
