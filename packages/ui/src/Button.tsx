import React from 'react';

export const Button = ({ text = 'Púlsame' }: { text: string }) => {
  return <button style={{ background: 'red' }}>{text}</button>;
};
