/**
 * Converts ISO date string to LocalDateTime format expected by Spring Boot
 * @param isoString - ISO 8601 format string from FullCalendar
 * @returns LocalDateTime format: yyyy-MM-ddTHH:mm:ss
 */
export const formatLocalDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
