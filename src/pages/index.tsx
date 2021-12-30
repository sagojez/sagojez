import * as React from "react";
import Layout from "../components/layout/Layout";
import Preview, { IPreview } from "../components/preview/Preview";
import Seo from "../components/seo/Seo";

const Posts: IPreview[] = [
  {
    isNew: true,
    title: "Don't talk about my absence",
    date: "March 30, 2021",
    author: "Samuel Gomez",
    summary: (
      <>
        Glad you’re here. I don’t know how you got here, but I’m glad you did.
        My name is Samuel, currently, SWE at
        <b> Buildable</b>, based in Barranquilla, Colombia...
      </>
    ),
    slug: "don't-talk-about-my-absence",
    image: "hero.png",
  },
  {
    isNew: false,
    title: "Machine Learning and sleeping",
    date: "August 23, 2020",
    author: "Samuel Gomez",
    summary:
      "About five months ago, I was lying in my bed, just harking the wind and thinking all those futile questions that generally lead nowhere—those types of questions that every beginner programmer makes to himself.",
    slug: "machine-learning-and-sleeping",
  },
];

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Home" />
      <Preview posts={Posts} />
    </Layout>
  );
};

export default IndexPage;
