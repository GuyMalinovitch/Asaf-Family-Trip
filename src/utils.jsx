

export function renderTextWithLinks(text) {
  if (!text) return null;
  
  // Regex to detect http/https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text around URLs
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: '#1a73e8', textDecoration: 'underline' }}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
