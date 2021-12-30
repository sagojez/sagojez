import { Link } from "gatsby";
import Img from "gatsby-image";
import * as React from "react";
import { useGetImage } from "../../hooks/useGetImage";

export interface IPreview {
  title: string;
  date: string;
  summary: string | React.ReactNode;
  slug: string;
  image?: string;
  isNew: boolean;
  author: string;
}

const Preview = ({ posts }: { posts: IPreview[] }) => {
  const { getImage } = useGetImage();

  const Image = ({
    image,
    extension,
    alt,
  }: {
    image;
    extension: string;
    alt: string;
  }) => {
    if (extension === "svg") {
      return <img src={image} className="add-padding" alt={alt} />;
    }
    return <Img className="add-padding" fluid={image} alt={alt} />;
  };

  return (
    <section>
      {posts.map((post) => (
        <div className="section wf-section" key={post.slug}>
          <div className="main-container center-align">
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <Link
                    to={`/${post.slug}`}
                    className="post-container no-top-padding w-inline-block"
                  >
                    {post.image && (
                      <Image
                        image={getImage(post.image).src}
                        extension={getImage(post.image).extension}
                        alt={post.title}
                      />
                    )}

                    <div>
                      <div
                        className={
                          post.isNew
                            ? "new-post"
                            : "new-post w-condition-invisible"
                        }
                      >
                        New!
                      </div>
                      <div className="post-date">{post.date}</div>
                    </div>
                    <h1>{post.title}</h1>
                    <div className="post-author-container">
                      <div className="by-text">by</div>
                      <div className="post-author">{post.author}</div>
                    </div>
                    <p className="post-summary">{post.summary}</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Preview;
