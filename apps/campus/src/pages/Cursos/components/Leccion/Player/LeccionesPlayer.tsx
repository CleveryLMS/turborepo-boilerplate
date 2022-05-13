import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import ReactPlayer from 'react-player';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { BiCog, BiError, BiExitFullscreen, BiFullscreen, BiPause, BiPlay, BiVolumeFull, BiVolumeMute } from 'react-icons/bi';
import {
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Tooltip,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';

import { LoginContext, ProgresoGlobalContext } from '../../../../../shared/context';
import { EVENTO_VIDEO_PAUSE, EVENTO_VIDEO_PLAY } from '../../../../../controllers';
import { ILeccion } from 'data';
import { updateProgresoGlobal } from 'data';
import { capitalizeFirst, fmtSnds, onFailure } from 'utils';

import './LeccionesPlayer.css';
import { ThumbnailLeccion, ThumbnailSizeEnum } from 'ui';

const PROGRESO_VIDEO = 60 * 5;

let controlsTimeout: any;
let values = { duration: 0, played: 0 };

interface PlayerProps {
  player: any;
  leccion?: ILeccion;
  enableKeyboard?: boolean;
  onLeccionStarted: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}

type Quality = '360p' | '720p' | '1080p' | 'auto';

export const LeccionesPlayer = ({ player, leccion, enableKeyboard, onLeccionCompleted, onLeccionStarted }: PlayerProps) => {
  const toast = useToast();
  const fullscreenHandler = useFullScreenHandle();

  const { progresoGlobal, setProgresoGlobal } = useContext(ProgresoGlobalContext);

  const { user } = useContext(LoginContext);

  const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);
  const [savedSeconds, setSavedSeconds] = useState<number>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<Quality>('auto');
  const [isMute, setIsMute] = useState<boolean>(false);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  const [refreshProgressVideo, setRefreshProgressVideo] = useState<boolean>(false);
  const [shouldMountPlayer, setShouldMountPlayer] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isMobilePlayer] = useMediaQuery('(max-width: 490px)');
  const valuesRef = useRef(values);

  const handleKeyboardCallback = useCallback((e: any) => handleKeyboardControls(e), []);

  function updateProgresoVideo() {
    if (leccion?.id && progresoGlobal?.progresoLecciones) {
      const _progresoLecciones = progresoGlobal?.progresoLecciones;

      _progresoLecciones[leccion?.id] = playedSeconds;
      _progresoLecciones.lastPlayed = leccion?.id;

      updateProgresoGlobal({
        client: 'campus',
        id: progresoGlobal?.id || 0,
        progresoGlobal: { progresoLecciones: _progresoLecciones },
      });
    }
  }

  useEffect(() => {
    valuesRef.current.duration = duration;
    valuesRef.current.played = playedSeconds;
  }, [duration, playedSeconds]);

  useEffect(() => {
    if (enableKeyboard) {
      window.addEventListener('keydown', handleKeyboardCallback);
    } else {
      window.removeEventListener('keydown', handleKeyboardCallback);
    }
  }, [enableKeyboard]);

  /*   useEffect(() => {
    window.removeEventListener('keydown', handleKeyboardCallback);
    window.addEventListener('keydown', handleKeyboardCallback);
  }, [playedSeconds, duration, player]); */

  useEffect(() => {
    setIsFirstPlay(true);
  }, [leccion?.id]);

  useEffect(() => {
    setIsReady(false);
    setIsPlaying(false);
    setRefreshProgressVideo(!refreshProgressVideo);
  }, []);

  useEffect(() => {
    const progresoLecciones: any = setTimeout(() => {
      return progresoGlobal?.progresoLecciones;
    }, 1000);

    const segundos = progresoLecciones && leccion?.id ? progresoLecciones[leccion?.id] : 0;

    setError(false);
    setIsPlaying(false);
    setSavedSeconds(segundos);
    setPlayedSeconds(segundos);
  }, [leccion]);

  useEffect(() => {
    if (shouldMountPlayer && isReady && player?.current) player?.current?.seekTo(playedSeconds);
  }, [shouldMountPlayer]);

  useEffect(() => {
    setTimeout(() => updateProgresoVideo(), PROGRESO_VIDEO * 1000);
  }, [refreshProgressVideo]);

  const onProgressChange = async (playedSeconds: number) => {
    await player?.current?.seekTo(playedSeconds);
  };

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);

    if (volume === 0) setIsMute(true);
    else setIsMute(false);
  };

  const showControls = (shouldSetTimeout: boolean) => {
    setAreControlsVisible(true);
    clearTimeout(controlsTimeout);

    if (shouldSetTimeout) controlsTimeout = setTimeout(() => setAreControlsVisible(false), 3000);
  };

  const handleOnReady = async () => {
    /** Verificamos que no vayamos a navegar a unos segundos del video incorrectos. */
    let canSeek = savedSeconds !== undefined && savedSeconds >= 0;

    if (canSeek) await player?.current?.seekTo(savedSeconds);
    await setIsPlaying(false);

    setIsReady(true);

    return true;
  };

  function handleOnEnded() {
    if (leccion) {
      onLeccionCompleted(leccion);
      updateProgresoVideo();
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste.'
      );
    }
  }

  function handleOnStart() {
    if (leccion) {
      onLeccionStarted(leccion);

      if (!progresoGlobal?.progresoLecciones[leccion.id || 0]) {
        updateProgresoGlobal({
          id: user?.progresoGlobal.id || 0,
          progresoGlobal: JSON.parse(`{"progresosLecciones": {"${leccion?.id || 0}": ${playedSeconds}}}`),
        })
          .then((res) => setProgresoGlobal({ ...res?.value?.data }))
          .catch((error) => console.error(error));
      }
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste..'
      );
    }
  }

  function seekTo(seconds: number) {
    player?.current?.seekTo(seconds);
    setIsPlaying(false);
  }

  function handleOnSeek(seconds: number) {
    setPlayedSeconds(seconds);
  }

  function handleOnPlay() {
    setIsPlaying(true);

    const onPlayEvent = new Event(EVENTO_VIDEO_PLAY);

    window.dispatchEvent(onPlayEvent);
  }

  function handleOnPause() {
    setIsPlaying(false);
    updateProgresoVideo();

    const onPauseEvent = new Event(EVENTO_VIDEO_PAUSE);

    window.dispatchEvent(onPauseEvent);
  }

  const handleChangeQuality = async (quality: Quality) => {
    await setShouldMountPlayer(false);
    await setQuality(quality);
    await setShouldMountPlayer(true);
  };

  function handleKeyboardControls(event: KeyboardEvent) {
    if (event.code === 'ArrowRight') seekTo(Math.min(valuesRef.current.duration, valuesRef.current.played + 60));

    if (event.code === 'ArrowLeft') seekTo(Math.max(0, valuesRef.current.played - 60));

    if (event.code === 'Space') setIsPlaying((current) => !current);
  }

  return error ? (
    <Center color="white" w="100%" bg="#000" style={{ aspectRatio: '16/9' }}>
      <Icon m="20px" fontSize="7xl" as={BiError} />

      <Flex fontWeight="bold" fontSize="3xl">
        Se ha producido un error inesperado
      </Flex>

      <Flex fontSize="xl">Inténtalo de nuevo más tarde</Flex>
    </Center>
  ) : (
    <FullScreen className="w100 h100 hidden" handle={fullscreenHandler}>
      <Flex boxSize="100%" position="relative">
        {isFirstPlay && (
          <Flex position="absolute" zIndex="50" boxSize="100%">
            <Flex boxSize="100%" align="center" justify="center" position="relative">
              <Icon
                as={BiPlay}
                position="absolute"
                bg="rgba(0, 0, 0, 0.6)"
                color="#fff"
                boxSize="64px"
                zIndex="15"
                rounded="full"
                marginLeft="auto"
                marginRight="0"
                p="2px 0px 2px 4px"
                border="1px solid rgba(255, 255, 255, 0.15)"
                transition="all 0.5s ease"
                _hover={{ bgColor: 'var(--chakra-colors-primary_neon)' }}
                onClick={() => {
                  setIsFirstPlay(false);
                  setIsPlaying(true);
                }}
              />

              <ThumbnailLeccion
                leccion={leccion}
                size={ThumbnailSizeEnum.FULL}
                leccionNumber={leccion?.orden}
                curso={leccion?.modulo?.curso}
                moduloNumber={leccion?.modulo?.orden}
              />
            </Flex>
          </Flex>
        )}
        <Flex
          bg="#000"
          boxSize="100%"
          position="relative"
          style={{ aspectRatio: '16/9' }}
          minH={{ base: '248px', sm: '348px' }}
          // maxH={fullscreenHandler.active ? {} : { base: '650px', '2xl': '748px' }}
        >
          <ReactPlayer
            pip
            allowFullScreen
            width="100%"
            height="100%"
            ref={player}
            muted={isMute}
            controls={false}
            playing={isPlaying}
            volume={(volume || 0) / 100}
            playbackRate={playbackSpeed || 1}
            url={leccion?.contenido || ''}
            onPlay={handleOnPlay}
            onSeek={handleOnSeek}
            onReady={handleOnReady}
            onStart={handleOnStart}
            onEnded={handleOnEnded}
            onPause={handleOnPause}
            onBuffer={() => setIsBuffering(true)}
            onBufferEnd={() => setIsBuffering(false)}
            onDuration={(d) => setDuration(d)}
            onProgress={(p) => setPlayedSeconds(p?.playedSeconds)}
            config={{
              vimeo: { playerOptions: { quality: quality, responsive: true } },
            }}
            style={{
              aspectRatio: '16/9',
              display: shouldMountPlayer ? 'unset' : 'none',
            }}
          />

          <Flex
            top="0px"
            left="0px"
            right="0px"
            bottom="54px"
            align="center"
            justify="center"
            position="absolute"
            onMouseMove={() => showControls(true)}
            onClick={() => setIsPlaying(!isPlaying)}
            cursor={areControlsVisible ? 'pointer' : 'none'}
            bg={isBuffering || !isPlaying ? 'blackAlpha.400' : 'transparent'}
          >
            {isBuffering && <Spinner size="xl" color="white" />}
            {!isBuffering && !isPlaying && <Icon fontSize="90px" color="#FFF" as={BiPlay} />}
          </Flex>

          <Flex
            color="white"
            align="center"
            px="16px"
            h="54px"
            left="0px"
            right="0px"
            bottom="0px"
            position="absolute"
            bg="rgb(0, 0, 0, 0.6)"
            onMouseEnter={() => showControls(false)}
            style={{ backdropFilter: 'blur(100px)' }}
            visibility={!isPlaying || areControlsVisible ? 'visible' : 'hidden'}
          >
            <Icon
              boxSize="32px"
              cursor="pointer"
              color="whiteAlpha.800"
              as={isPlaying ? BiPause : BiPlay}
              onClick={() => setIsPlaying(!isPlaying)}
            />

            <Flex w="100%" px="8px" align="center" gap="8px" tabIndex={-1}>
              <Slider
                tabIndex={-1}
                h="5px"
                max={duration || 100}
                value={playedSeconds}
                focusThumbOnChange={false}
                onChange={onProgressChange}
                aria-label="video-playedSeconds"
              >
                <SliderTrack bgColor="whiteAlpha.300">
                  <SliderFilledTrack bgColor="whiteAlpha.800" />
                </SliderTrack>

                <Tooltip
                  color="#000"
                  placement="top"
                  bgColor="white"
                  label={fmtSnds(playedSeconds)}
                  visibility={isPlaying ? 'hidden' : 'visible'}
                >
                  <SliderThumb tabIndex={-1} bg="whiteAlpha.900" />
                </Tooltip>
              </Slider>

              <Flex color="whiteAlpha.800">{`${duration - playedSeconds > 0 ? '-' : ''}${fmtSnds(
                duration - playedSeconds
              )}`}</Flex>

              {!isMobilePlayer && (
                <>
                  <Menu placement="top">
                    <Tooltip placement="top" label="Velocidad de reproducción">
                      <MenuButton
                        as={Button}
                        p="0px"
                        w="fit-content"
                        minW="fit-content"
                        bg="transparent"
                        paddingInline="0px"
                        color="whiteAlpha.800"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      >
                        <Icon boxSize="25px" cursor="pointer" as={BiCog} />
                      </MenuButton>
                    </Tooltip>

                    <MenuList title="Velocidad de reproducción" color="black">
                      <MenuItem onClick={() => setPlaybackSpeed(0.25)}>x0.25</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(0.5)}>x0.5</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(0.75)}>x0.75</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(1)}>x1</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(1.25)}>x1.25</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(1.5)}>x1.5</MenuItem>

                      <MenuItem onClick={() => setPlaybackSpeed(2)}>x2</MenuItem>
                    </MenuList>
                  </Menu>

                  <Menu placement="top">
                    <Tooltip placement="top" label="Calidad de reproducción">
                      <MenuButton
                        alignContent="center"
                        justify="center"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                        as={Button}
                        p="0px"
                        pt="3px"
                        pl="1px"
                        m="0px"
                        bg="transparent"
                        color="whiteAlpha.800"
                      >
                        <Flex>{capitalizeFirst(quality)}</Flex>
                      </MenuButton>
                    </Tooltip>

                    <MenuList title="Velocidad de reproducción" color="black">
                      <MenuItem onClick={() => handleChangeQuality('1080p')}>1080p</MenuItem>
                      <MenuItem onClick={() => handleChangeQuality('720p')}>720p</MenuItem>
                      <MenuItem onClick={() => handleChangeQuality('360p')}>360p</MenuItem>
                      <MenuItem onClick={() => handleChangeQuality('auto')}>Auto</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )}

              {isMobilePlayer && (
                <Menu placement="top">
                  <Tooltip placement="top" label="Ajustes">
                    <MenuButton
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                      as={Button}
                      p="0px"
                      w="fit-content"
                      minW="fit-content"
                      bg="transparent"
                      paddingInline="0px"
                      color="whiteAlpha.800"
                    >
                      <Icon boxSize="25px" cursor="pointer" as={BiCog} />
                    </MenuButton>
                  </Tooltip>

                  <MenuList
                    p="5px"
                    color="#000"
                    w="fit-content"
                    display="flex"
                    bg="whiteAlpha.900"
                    flexDirection="column"
                    title="Velocidad de reproducción"
                  >
                    <Menu>
                      <MenuButton
                        as={Button}
                        p="0px"
                        w="fit-content"
                        minW="fit-content"
                        bg="transparent"
                        color="#5b5b5b"
                        paddingInline="0px"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      >
                        Velocidad
                      </MenuButton>

                      <MenuList title="Velocidad de reproducción" color="#000">
                        <MenuItem onClick={() => setPlaybackSpeed(0.25)}>x0.25</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(0.5)}>x0.5</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(0.75)}>x0.75</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1)}>x1</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1.25)}>x1.25</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(1.5)}>x1.5</MenuItem>
                        <MenuItem onClick={() => setPlaybackSpeed(2)}>x2</MenuItem>
                      </MenuList>
                    </Menu>

                    <Menu placement="top">
                      <Tooltip placement="top" label="Calidad de reproducción">
                        <MenuButton
                          justify="center"
                          alignContent="center"
                          _hover={{ bg: 'transparent' }}
                          _active={{ bg: 'transparent' }}
                          as={Button}
                          p="0px"
                          pt="3px"
                          pl="1px"
                          m="0px"
                          bg="transparent"
                          color="#5b5b5b"
                        >
                          <Flex>{capitalizeFirst(quality)}</Flex>
                        </MenuButton>
                      </Tooltip>

                      <MenuList title="Velocidad de reproducción" color="black">
                        <MenuItem onClick={() => handleChangeQuality('1080p')}>1080p</MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('720p')}>720p</MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('360p')}>360p</MenuItem>
                        <MenuItem onClick={() => handleChangeQuality('auto')}>Auto</MenuItem>
                      </MenuList>
                    </Menu>
                  </MenuList>
                </Menu>
              )}

              {!isMobilePlayer && (
                <>
                  <Icon
                    cursor="pointer"
                    fontSize="25px"
                    color="whiteAlpha.800"
                    onClick={() => setIsMute(!isMute)}
                    as={isMute ? BiVolumeMute : BiVolumeFull}
                  />

                  <Slider
                    value={isMute ? 0 : volume}
                    onChange={(v) => handleVolumeChange(v)}
                    min={0}
                    max={100}
                    w="120px"
                    h="5px"
                    aria-label="video-playedSeconds"
                  >
                    <SliderTrack bgColor="whiteAlpha.200">
                      <SliderFilledTrack bgColor="whiteAlpha.800" />
                    </SliderTrack>

                    <SliderThumb bg="whiteAlpha.900" />
                  </Slider>
                </>
              )}

              {isMobilePlayer && (
                <Popover placement="top">
                  <PopoverTrigger>
                    <IconButton
                      bg="transparent"
                      color="whiteAlpha.800"
                      aria-label="sonido"
                      fontSize="25px"
                      p="0px"
                      w="fit-content"
                      minW="fit-content"
                      paddingInline="0px"
                      outline="none"
                      _active={{ border: 'none' }}
                      icon={<Icon boxSize="25px" as={isMute ? BiVolumeMute : BiVolumeFull} />}
                    />
                  </PopoverTrigger>

                  <PopoverContent w="fit-content" bg="transparent" border="none" _active={{ outline: 'none' }}>
                    <PopoverBody>
                      <Slider
                        w="5px"
                        h="120px"
                        min={0}
                        max={100}
                        orientation="vertical"
                        aria-label="video-playedSeconds"
                        value={isMute ? 0 : volume}
                        onChange={(v) => handleVolumeChange(v)}
                      >
                        <SliderTrack bgColor="whiteAlpha.300">
                          <SliderFilledTrack bgColor="whiteAlpha.800" />
                        </SliderTrack>
                        <SliderThumb bg="whiteAlpha.900" />
                      </Slider>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}

              <Tooltip placement="top" label={fullscreenHandler.active ? 'Exit fullscreen' : 'Fullscreen'}>
                <Icon
                  ml="8px"
                  fontSize="20px"
                  cursor="pointer"
                  color="whiteAlpha.800"
                  onClick={fullscreenHandler.active ? fullscreenHandler.exit : fullscreenHandler.enter}
                  as={fullscreenHandler.active ? BiExitFullscreen : BiFullscreen}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </FullScreen>
  );
};
