import { FormikErrors, useFormik } from "formik";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";
import { Book } from "../type";
import { getBooks } from "../util/firebaseAction";

interface HomeDataType {
  books: Book[];
}

interface FormValues {
  title: string;
  author: string;
}

const Home: NextPage<HomeDataType> = ({ books }) => {
  console.log("books", books);
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
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

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
        />
        <div className={styles.error}>{formik.errors.title}</div>
        <input
          className={styles.input}
          type="text"
          name="author"
          placeholder="Author"
          onChange={formik.handleChange}
          value={formik.values.author}
        />
        <div className={styles.error}>{formik.errors.author}</div>
        <button className={styles.submitButton} type="submit">
          Submit
        </button>
      </form>

      <div>Book List</div>
      {books.map((book) => (
        <div key={book.id} className={styles.book_item}>
          Title : {book.title}, Author: {book.author}
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
  };
};
