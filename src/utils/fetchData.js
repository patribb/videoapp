import { firebaseApp } from "../firebase-config";
import { collection, getDocs, orderBy, query, doc, getDoc, deleteDoc, where } from 'firebase/firestore';

// fetch all data from firebase
export const getAllFeeds = async (fireStoreDb) => {
    const feeds = await getDocs(query(
        collection(fireStoreDb, 'videos'), orderBy('id', 'desc')
    ))

    return feeds.docs.map(doc => doc.data());
}

// CategoryWise Feeds
export const categoryFeeds = async (firestoreDb, categoryId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("category", "==", categoryId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};

// Get recommended feeds
export const recommendedFeeds = async (firestoreDb, categoryId, videoId) => {
    const feeds = await getDocs(
      query(
        collection(firestoreDb, "videos"),
        where("category", "==", categoryId),
        where("id", "!=", videoId),
        orderBy("id", "desc")
      )
    );
  
    return feeds.docs.map((doc) => doc.data());
  };

// useruploaded videos
export const userUploadedVideos = async (firestoreDb, userId) => {
  const feeds = await getDocs(
    query(
      collection(firestoreDb, "videos"),
      where("userId", "==", userId),
      orderBy("id", "desc")
    )
  );

  return feeds.docs.map((doc) => doc.data());
};  

// fetch the user info use userId
export const getUserInfo = async (fireStoreDb, userId) => {
  const userRef = doc(fireStoreDb, 'users', userId);
  const userSnap = await getDoc(userRef);
  if(userSnap.exists()){
      return userSnap.data()
  } else {
      return 'No Such Document'
  }
}

// fetch a specifict video
export const getSpecificVideo = async (fireStoreDb, videoId) => {
  const videoRef = doc(fireStoreDb, 'videos', videoId);
  const videoSnap = await getDoc(videoRef);
  if(videoSnap.exists()){
      return videoSnap.data()
  } else {
      return 'No Such Document'
  }
}

// delete video 
export const deleteVideo = async (fireStoreDb, videoId) => {
    await deleteDoc(doc(fireStoreDb, 'videos', videoId));
}

