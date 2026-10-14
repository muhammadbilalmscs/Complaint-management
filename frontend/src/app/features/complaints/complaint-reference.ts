/** Public reference shown in the complaints table. Complaint 1 is CC-0001. */
export function formatComplaintReference(id: number): string {
  const sequence = id - 1;
  return `CC-${String(sequence).padStart(4, '0')}`;
}
