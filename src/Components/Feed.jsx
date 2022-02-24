import { useEffect, useState } from "react";
import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";
import { categoryFeeds, getAllFeeds } from "../utils/fetchData";
import { SimpleGrid } from "@chakra-ui/react";
import { VideoPin, Spinner, NotFound } from ".";
import { useParams } from "react-router-dom";

const Feed = () => {
    // firestore database instance
    const firestoreDb = getFirestore(firebaseApp);

    const [feeds, setFeeds] = useState(null);
    const [loading, setLoading] = useState(false);
    const { categoryId } = useParams();
  
    useEffect(() => {
      setLoading(true);
      if (categoryId) {
        categoryFeeds(firestoreDb, categoryId).then((data) => {
          setFeeds(data);
          setLoading(false);
        });
      } else {
        getAllFeeds(firestoreDb).then((data) => {
          setFeeds(data);
          setLoading(false);
        });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

  if (loading) return <Spinner msg={"Loading your feeds"} />;
  if (!feeds?.length > 0) return <NotFound />;

  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width="full"
      autoColumns={"max-content"}
      px="2px"
      overflow={'hidden'}
    >
      {feeds && feeds.map((data) => (
        <VideoPin key={data.id} maxWidth={420} height='80' data={data} />
      ))}
    </SimpleGrid>
  );
};

export default Feed;
