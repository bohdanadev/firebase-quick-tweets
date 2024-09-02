import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export const getTrendings = async () => {
  const trendingRef = doc(db, "trending", "topics");
  const trendingDocSnap = await getDoc(trendingRef);

  if (!trendingDocSnap.exists()) {
    throw new Error("No trending topics found");
  }

  const trendingData = trendingDocSnap.data();
  return trendingData;
};

export const aggregateTrendingTopics = async () => {
  const pageSize = 2;
  try {
    const topLikedQ = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(pageSize)
    );

    const topLikedPostsSnapshot = await getDocs(topLikedQ);

    const topLikedPosts = topLikedPostsSnapshot.docs.map((doc) => doc.data());

    const topDiscussedQ = query(
      collection(db, "posts"),
      orderBy("commentsCount", "desc"),
      limit(pageSize)
    );

    const topDiscussedPostsSnapshot = await getDocs(topDiscussedQ);

    const topDiscussedPosts = topDiscussedPostsSnapshot.docs.map((doc) =>
      doc.data()
    );
    await setDoc(doc(db, "trending", "topics"), {
      topLikedPosts,
      topDiscussedPosts,
      lastUpdated: serverTimestamp(),
    });

    console.log("Trending topics aggregated successfully");
  } catch (error) {
    console.error("Error aggregating trending topics:", error);
  }
};
