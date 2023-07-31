export default function formatDateAndTime(firebaseTimestamp) {
  const jsDate = new Date(firebaseTimestamp.seconds * 1000);
  const formattedDate = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
