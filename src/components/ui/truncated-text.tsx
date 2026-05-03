import React, { useState } from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxLength = 60, className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span className={className}>{text || ''}</span>;
  }

  return (
    <span className={className}>
      {expanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="ml-1 text-[#C5A059] hover:text-[#E0CA78] transition-colors font-bold text-[9px] uppercase tracking-widest"
      >
        {expanded ? 'See less' : 'See more'}
      </button>
    </span>
  );
};

export default TruncatedText;
