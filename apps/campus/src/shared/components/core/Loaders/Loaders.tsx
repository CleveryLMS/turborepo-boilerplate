import React, { useState, useEffect } from 'react';
import ContentLoader, { Instagram } from 'react-content-loader';

export const ListLoader = ({ num = 2, ...props }: { num: number }) => (
  <ContentLoader
    speed={2}
    width={400}
    height={150}
    viewBox="0 0 400 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {Array.from(Array(num).keys())?.map((x, index: number) => (
      <React.Fragment key={'listloader-item-' + index}>
        <circle cx="10" cy="20" r="8" />
        <rect x="25" y={0 + 30 * index} rx="5" ry="5" width="220" height="10" />
      </React.Fragment>
    ))}
  </ContentLoader>
);

export const TextLoader = ({ lines = 3, ...props }: { lines: number }) => (
  <ContentLoader
    speed={2}
    width={476}
    height={124}
    viewBox="0 0 476 124"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    {Array.from(Array(lines).keys())?.map((x, index: number) => (
      <React.Fragment key={'textloader-item-' + index}>
        <rect x="0" y={0 + 16 * index} rx="3" ry="3" width="410" height="6" />
      </React.Fragment>
    ))}
  </ContentLoader>
);

export const ItemLoader = ({ ...props }) => (
  <ContentLoader
    speed={2}
    width={80}
    height={40}
    viewBox="0 0 80 40"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="15" rx="5" ry="5" width="64" height="10" />
  </ContentLoader>
);

export const CardLoader = ({ ...props }) => {
  const [maxW, setMaxW] = useState<string>('calc(100%/4 - 20px)');

  useEffect(() => {
    handleCardMaxWidth();
    window.addEventListener('resize', handleCardMaxWidth);

    return () => window.removeEventListener('resize', handleCardMaxWidth);
  }, []);

  const handleCardMaxWidth = () => {
    const width = window.innerWidth;

    if (width > 1440) setMaxW('calc(100%/5 - 20px)');
    else if (width > 1024) setMaxW('calc(100%/4 - 20px)');
    else if (width > 768) setMaxW('calc(100%/3 - 20px)');
    else setMaxW('calc(100%/2 - 20px)');
  };

  return <Instagram style={{ maxWidth: maxW }} />;
};
