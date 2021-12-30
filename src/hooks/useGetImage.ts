import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";

export const useGetImage = () => {
  const data = useStaticQuery(graphql`
    query {
      images: allFile(
        filter: { internal: { mediaType: { regex: "/image/" } } }
      ) {
        edges {
          node {
            relativePath
            extension
            publicURL
            childImageSharp {
              fluid(maxWidth: 600) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `);

  const getImage = (image: string) => {
    const match = React.useMemo(
      () => data.images.edges.find(({ node }) => image === node.relativePath),
      [data, image]
    );

    if (!match) return null;

    const {
      node: { childImageSharp, publicURL, extension } = {
        childImageSharp,
        publicURL,
        extension,
      },
    } = match;

    if (extension === "svg" || !childImageSharp) {
      return { src: publicURL, extension };
    }
    return { src: childImageSharp.fluid, extension };
  };
  return {
    getImage,
  };
};
