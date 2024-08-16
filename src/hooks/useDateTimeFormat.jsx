import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


const useDateTimeFormat = (isoDateString) => {
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  // Convert ISO 8601 string to Date object
  const date = new Date(isoDateString);

  // Format date and time
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const time = date.toLocaleTimeString('en-US', { hour12: true, timeZone: 'UTC' });

  return `${day}-${month}-${year}, ${time}`;
};

export default useDateTimeFormat;