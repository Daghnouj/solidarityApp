export const extractHashtags = (content: string): string[] => {
  if (!content) return [];
  
  const regex = /#([\wÀ-ÿ]+)/g;
  const matches = [...content.matchAll(regex)];
  if (!matches.length) return [];
  
  return [...new Set(
    matches.map(match => match[1].toLowerCase())
  )];
};