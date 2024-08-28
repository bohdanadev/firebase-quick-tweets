import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getTrendings = async () => {
  const trendingRef = doc(db, "trending", "topics");
  const trendingDocSnap = await getDoc(trendingRef);

  if (!trendingDocSnap.exists()) {
    throw new Error("No trending topics found");
  }

  const trendingData = trendingDocSnap.data();
  return trendingData;
};
