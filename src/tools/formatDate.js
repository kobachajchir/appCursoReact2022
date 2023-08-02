export default function formatDateAndTime(firebaseTimestamp) {
  if (!firebaseTimestamp) {
    return ""; // Handle the case when firebaseTimestamp is not defined or null
  }

  const jsDate = new Date(firebaseTimestamp.seconds * 1000);
  if (isNaN(jsDate.getTime())) {
    return ""; // Handle the case when firebaseTimestamp is not a valid timestamp
  }

  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(jsDate);
  return formattedDate;
}

export function formatNewDate() {
  const jsDate = new Date(); // Get the current date and time
  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long", // Full month name
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short", // Display UTC offset and timezone abbreviation
  }).format(jsDate);
  return formattedDate;
}

export function formatDate(firebaseTimestamp) {
  const jsDate = new Date(firebaseTimestamp.seconds * 1000);
  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(jsDate);
  return formattedDate;
}
