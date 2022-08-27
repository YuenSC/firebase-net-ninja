import { collection, getDocs } from "@firebase/firestore";

import { Book } from "../type";
import db from "./firebase";

export const getBooks = async () => {
  const collectionRef = collection(db, "books");
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({ ...(doc.data() as Book), id: doc.id }));
};
