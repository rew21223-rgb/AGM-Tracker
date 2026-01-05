export const formatThaiDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() + 543;
  
  return `${day}/${month}/${year}`;
};

export const formatThaiDateTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';
  
  const dateStr = formatThaiDate(date);
  const timeStr = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  
  return `${dateStr} ${timeStr}`;
};