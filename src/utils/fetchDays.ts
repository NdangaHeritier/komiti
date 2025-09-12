// Helper function to calculate days difference
  export default function daysAgo(date: Date | undefined) {
    if (!date) return "-";
    const now = new Date();
    const diffTime = now.getTime() - date.getTime(); // difference in ms
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // convert ms to days
    return diffDays;
  }