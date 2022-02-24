import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { IoHome, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { FcApproval } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RecommendedVideos, Spinner } from ".";
import { firebaseApp } from "../firebase-config";
import {
  deleteVideo,
  getSpecificVideo,
  getUserInfo,
  recommendedFeeds,
} from "../utils/fetchData";
import ReactPlayer from "react-player";
import {
  MdFullscreen,
  MdOutlineForward10,
  MdOutlineReplay10,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import logo from "../images/logo.png";
import screenfull from "screenfull";
import HTMLReactParser from "html-react-parser";
import moment from "moment";
import { fetchUser } from "../utils/fetchUser";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}: ${mm.toString().padStart(2, "0")} : ${ss}`;
  }
  return `${mm}:${ss}`;
};

const avatar =
  "https://w7.pngwing.com/pngs/199/296/png-transparent-creative-zebra-avatar-art-colored-glasses-animal.png";

const VideoPinDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const { videoId } = useParams();
  const firestoreDb = getFirestore(firebaseApp);
  const [localUser] = fetchUser();
  const navigate = useNavigate();

  // Custom reference
  const playerRef = useRef();
  const playerContainer = useRef();

  const textColor = useColorModeValue("gray.100", "gray.100");

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDb, videoId).then((data) => {
        setVideoInfo(data);
        recommendedFeeds(firestoreDb, data.category, videoId).then((feed) => {
          setFeeds(feed);
        });
        getUserInfo(firestoreDb, data.userId).then((user) => {
          setUserInfo(user);
        });
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {}, [muted, volume, played]);

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));
    e === 0 ? setMuted(true) : setMuted(false);
  };

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(e / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);

  const deleteTheVideo = (videoId) => {
    setIsLoading(true);
    deleteVideo(firestoreDb, videoId);
    navigate("/", { replace: true });
  };

  if (isLoading) return <Spinner />;

  return (
    <Flex
      width={"full"}
      height="auto"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
      py={2}
      px={4}
    >
      <Flex alignItems={"center"} width="full" my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width="1px" height={"25px"} bg={"gray.500"} mx={2}></Box>
        <Text
          isTruncated
          color={textColor}
          fontWeight="semibold"
          width={"100%"}
        >
          {videoInfo?.title}
        </Text>
      </Flex>
      {/* Main Grid for video */}
      <Grid templateColumns="repeat(4, 1fr)" gap={2} width="100%">
        <GridItem width={"100%"} colSpan="3" p={2}>
          <Flex
            width={"full"}
            bg="black"
            position="relative"
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoUrl}
              width="100%"
              height={"100%"}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
            />
            {/* Controls for video player */}
            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              direction="column"
              justifyContent={"space-between"}
              alignItems="center"
              zIndex={1}
              cursor="pointer"
            >
              {/* play icon */}
              <Flex
                alignItems={"center"}
                justifyContent="center"
                width="full"
                height="full"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
              >
                {!isPlaying && (
                  <IoPlay fontSize={60} color="#f2f2f2" cursor={"pointer"} />
                )}
              </Flex>
              {/* Progress controls */}
              <Flex
                width={"full"}
                alignItems="center"
                direction={"column"}
                px={4}
                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
              >
                <Slider
                  aria-label="slider-ex-4"
                  min={0}
                  max={100}
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDuration={"0.2"}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg="teal.50">
                    <SliderFilledTrack bg="teal.500" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={3}
                    bg="teal.300"
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                  />
                </Slider>
                {/* other player controls */}
                <Flex width={"full"} alignItems="center" my={2} gap={10}>
                  <MdOutlineReplay10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor={"pointer"}
                    onClick={handleFastRewind}
                  />
                  <Box onClick={() => setIsPlaying(!isPlaying)}>
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    ) : (
                      <IoPause
                        fontSize={30}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    )}
                  </Box>
                  <MdOutlineForward10
                    fontSize={30}
                    color={"#f1f1f1"}
                    cursor={"pointer"}
                    onClick={handleFastForward}
                  />
                  {/* Volume Controls */}
                  <Flex alignItems={"center"}>
                    <Box onClick={() => setMuted(!muted)}>
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={30}
                          color={"#f1f1f1"}
                          cursor={"pointer"}
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={30}
                          color={"#f1f1f1"}
                          cursor={"pointer"}
                        />
                      )}
                    </Box>
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      min={0}
                      max={100}
                      size="sm"
                      width={16}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChangeEnd={onvolumechange}
                    >
                      <SliderTrack bg="teal.50">
                        <SliderFilledTrack bg="teal.500" />
                      </SliderTrack>
                      <SliderThumb boxSize={2} bg="teal.300" />
                    </Slider>
                  </Flex>
                  {/* duration controls */}
                  <Flex alignItems={"center"} gap={2}>
                    <Text fontSize={16} color="whitesmoke">
                      {elapsedTime}
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      /
                    </Text>
                    <Text fontSize={16} color="whitesmoke">
                      {totalDuration}
                    </Text>
                  </Flex>
                  <Image src={logo} alt="logo" width={"120px"} ml="auto" />
                  <MdFullscreen
                    fontSize={30}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={() => {
                      screenfull.toggle(playerContainer.current);
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {/* Description video */}
          {videoInfo?.description && (
            <Flex my={6} direction="column">
              <Text
                my={2}
                fontSize={25}
                fontWeight="semibold"
                textDecoration={"underline"}
              >
                Description
              </Text>
              {HTMLReactParser(videoInfo?.description)}
            </Flex>
          )}
        </GridItem>
        <GridItem width={"100%"} colSpan="1">
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width="full">
                <Image
                  src={userInfo?.photoURL ? userInfo?.photoURL : avatar}
                  alt="user"
                  rounded="full"
                  width={"60px"}
                  height={"60px"}
                  objectFit="cover"
                  minHeight="60px"
                  minWidth={"60px"}
                />
                <Flex direction={"column"} ml={3}>
                  <Flex alignItems={"center"}>
                    <Text isTruncated color={textColor} fontWeight="semibold">
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={12}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>
              {/* Action buttons */}
              <Flex justifyContent={"space-around"} mt={6}>
                {userInfo?.uid === localUser.uid && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button colorScheme={"red"}>
                        <IoTrash fontSize={20} color="white" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete your video?
                      </PopoverBody>
                      <PopoverFooter d="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="red"
                            onClick={() => deleteTheVideo(videoId)}
                          >
                            Yes
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}
                {/* Download funcionallity */}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={videoInfo.videoUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    colorScheme={"whatsapp"}
                    rounded="full"
                    my={2}
                    mt={"0"}
                    width="48"
                  >
                    Free Download
                  </Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <Text my={4} fontSize={25} fontWeight="semibold" textDecoration='underline'>
            Recommended Videos
          </Text>
          <RecommendedVideos feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default VideoPinDetail;
