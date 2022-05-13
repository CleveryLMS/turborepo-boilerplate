import { useRef, useState, useEffect } from 'react';

import ReactPlayer from 'react-player';
import { Flex } from '@chakra-ui/react';

const OB_VIDEO_PRESENTACION = 'https://player.vimeo.com/video/624552211?h=73b30d1c1d';

export const VideoPlayer = ({ onEnded }: { onEnded?: (event?: any) => void }) => {
  const playerRef = useRef<any>();
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    setPlay(false);

    window.addEventListener('keydown', handleKeyboardControls);

    return () => window.removeEventListener('keydown', handleKeyboardControls);
  }, []);

  function handleKeyboardControls(event: KeyboardEvent) {
    const currentSeconds = playerRef?.current?.getCurrentTime() || 0;
    const totalSeconds = playerRef?.current?.getDuration();

    if (event.code === 'ArrowRight') playerRef?.current?.seekTo(Math.min(currentSeconds + 60, totalSeconds));
    if (event.code === 'ArrowLeft') playerRef?.current?.seekTo(Math.max(currentSeconds - 60, 0));
    if (event.code === 'Space') setPlay((current) => !current);
  }

  return (
    <Flex minH="380px" bg="white" rounded="15px" align="center">
      <ReactPlayer ref={playerRef} url={OB_VIDEO_PRESENTACION} playing={play} controls onEnded={onEnded} />
    </Flex>
  );
};
