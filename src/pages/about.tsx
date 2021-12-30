import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import Layout from "../components/layout/Layout";
import Seo from "../components/seo/Seo";

const About = () => {
  return (
    <Layout>
      <Seo title="About" />
      <div className="section no-padding wf-section">
        <div className="main-container center-align">
          <StaticImage
            src="../images/about.png"
            loading="lazy"
            sizes="(max-width: 767px) 92vw, 650px"
            alt=""
            className="add-padding"
          />
        </div>
      </div>
      <div className="section wf-section">
        <div className="main-container">
          <h1>About</h1>
          <div className="w-richtext">
            <h2>Hi</h2>
            <h3>Glad you’re here.</h3>
            <p>
              I don’t know how you got here, but I’m glad you did. My name is
              Samuel, currently, SWE @Torre, based in Barranquilla, Colombia. I
              also happen to be an Electronic Engineer from the Universidad del
              Norte⚡️. This little corner on the internet is about the things
              that I love the most… programming and reading. My motivation
              behind this blog is not getting famous but showing you a little
              bit of me and connecting with you. That’s why there’s a
              newsletter. Feel free to subscribe and answer (I won’t send you
              any spam, I hate it too). Hope you all are having a calm and
              restful day. See you.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
