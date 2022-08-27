import { async } from "@firebase/util";
import { FormikErrors, useFormik } from "formik";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import { Book } from "../type";
import {
  addBook,
  deleteBook,
  getBooks,
  subscriptBookSnapshot,
} from "../util/firebaseAction";

interface HomeDataType {
  books: Book[];
}

interface FormValues {
  title: string;
  author: string;
}

const Home: NextPage<HomeDataType> = ({ books: fallbackBook }) => {
  const [books, setBooks] = useState(fallbackBook);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      author: "",
    },
    validate: (value: FormValues) => {
      const { author, title } = value;
      const error: FormikErrors<FormValues> = {};
      if (!author) error.author = "Author is required";
      if (!title) error.title = "Title is required";

      return error;
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await addBook(values);
        resetForm();
        setSubmitting(false);
      } catch (error) {}
    },
  });

  const handleBookDelete = useCallback(async (id: string) => {
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const unsubscriptBookSnapshot = subscriptBookSnapshot((books) =>
      setBooks(books)
    );
    return unsubscriptBookSnapshot;
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <input
          className={styles.input}
          type="text"
          name="title"
          placeholder="Title"
          onChange={formik.handleChange}
          value={formik.values.title}
          disabled={formik.isSubmitting}
        />
        <div className={styles.error}>{formik.errors.title}</div>
        <input
          className={styles.input}
          type="text"
          name="author"
          placeholder="Author"
          onChange={formik.handleChange}
          value={formik.values.author}
          disabled={formik.isSubmitting}
        />
        <div className={styles.error}>{formik.errors.author}</div>
        <button
          disabled={formik.isSubmitting}
          className={styles.submitButton}
          type="submit"
        >
          Submit
        </button>
      </form>

      <div>Book List</div>
      {books.map((book) => (
        <div key={book.id} className={styles.book_row}>
          <div className={styles.book_item}>
            Title : {book.title}, Author: {book.author}
          </div>
          <button
            onClick={() => handleBookDelete(book.id)}
            style={{
              height: "fit-content",
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<HomeDataType> = async () => {
  const books = await getBooks();

  return {
    props: {
      books,
    },
    revalidate: 1,
  };
};
