export const formatDate = (date: number | Date | string) => {
  // Ensure the input is a valid Date object
  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    throw new Error("Invalid date value provided");
  }

  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
    formattedDate
  );
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
    formattedDate
  );
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(
    formattedDate
  );

  return `${day}-${month}-${year}`;
};
