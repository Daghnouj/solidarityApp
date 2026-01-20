// Extract YouTube video ID from any valid YouTube link
export const extractYouTubeId = (url: string): string => {
  const regExp =
    /(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?/ ]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : "";
};

// Format date from ISO string (ex: 2024-02-20T13:00:00Z)
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
