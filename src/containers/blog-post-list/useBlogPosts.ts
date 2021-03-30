import { useStaticQuery, graphql } from 'gatsby';

const useBlogPosts = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allContentfulBlogPost(sort: { fields: publishedDate, order: DESC }) {
          edges {
            node {
              title
              id
              slug
              publishedDate(formatString: "Do MMMM, YYYY")
              featuredImage {
                fluid(maxWidth: 750) {
                  ...GatsbyContentfulFluid
                }
              }
              excerpt {
                childMarkdownRemark {
                  excerpt(pruneLength: 150)
                }
              }
            }
          }
        }
      }
    `
  );
  return data;
};

export default useBlogPosts;
