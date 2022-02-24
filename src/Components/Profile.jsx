import { Flex, Image } from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecommendedVideos, Spinner } from ".";
import { firebaseApp } from "../firebase-config";
import { getUserInfo, userUploadedVideos } from "../utils/fetchData";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const Profile = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);

  const fireStoreDb = getFirestore(firebaseApp);

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      getUserInfo(fireStoreDb, userId).then((user) => {
        setUserInfo(user);
      });
      userUploadedVideos(fireStoreDb, userId).then((feed) => {
        setFeeds(feed);
      });
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (isLoading) return <Spinner />;

  return (
    <Flex
      alignItems={"center"}
      justifyContent="center"
      width={"full"}
      height="auto"
      p={2}
      direction="column"
    >
      <Flex
        justifyContent={"center"}
        width="full"
        position={"relative"}
        direction="column"
        alignItems={"center"}
      >
        <Image
          src={randomImage}
          height={"320px"}
          width="full"
          objectFit={"cover"}
          borderRadius={"md"}
        />

        <Image
          src={userInfo?.photoURL}
          width="120px"
          objectFit={"cover"}
          border="2px"
          borderColor={"gray.100"}
          rounded="full"
          shadow={"lg"}
          mt="-16"
        />
      </Flex>

      {feeds && (
        <Flex direction={"column"} width="full" my={6}>
          <RecommendedVideos feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
