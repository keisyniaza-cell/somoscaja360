export function formatCOP(value: number): string {
  if (isNaN(value)) return '$ 0 COP';
  return `$ ${new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value)} COP`;
}

export function formatCOPShort(value: number): string {
  if (isNaN(value)) return '$ 0';
  return `$ ${new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function formatFecha(dateStr: string): string {
  if (!dateStr) return 'Sin fecha';
  try {
    const parts = dateStr.split(' ');
    const dParts = parts[0].split('-');
    if (dParts.length === 3) {
      const year = dParts[0];
      const month = dParts[1];
      const day = dParts[2];
      const months = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      const mIdx = parseInt(month, 10) - 1;
      const formattedDate = `${day} ${months[mIdx] || month} ${year}`;
      return parts[1] ? `${formattedDate} · ${parts[1]}` : formattedDate;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    )
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
