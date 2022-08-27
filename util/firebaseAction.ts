import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";

import { Book } from "../type";
import db from "./firebase";

const booksRef = collection(db, "books");

export const getBooks = async () => {
  const snapshot = await getDocs(booksRef);
  return snapshot.docs.map((doc) => ({ ...(doc.data() as Book), id: doc.id }));
};

export const subscriptBookSnapshot = (onChange: (books: Book[]) => void) => {
  return onSnapshot(booksRef, (snapshot) => {
    const books = snapshot.docs.map((doc) => ({
      ...(doc.data() as Book),
      id: doc.id,
    }));
    onChange(books);
  });
};

export const addBook = async (book: Omit<Book, "id">) => {
  await addDoc(booksRef, book);
};

export const deleteBook = async (id: string) => {
  const docRef = doc(db, "books", id);
  await deleteDoc(docRef);
};
