import React from 'react';

export default function Studio37Logo(props) {
  return (
    <div {...props} className={`font-serif text-4xl font-bold ${props.className || ''}`}>
      Studio37
    </div>
  );
}