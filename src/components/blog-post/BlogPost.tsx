import React from 'react';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Img from 'gatsby-image';
import { graphql, useStaticQuery } from "gatsby"

import styles from './style';

interface Props {
  classes: any;
  data: any;
};



const BlogPost = ({ classes, data }: Props) => {
  const fallback = useStaticQuery(graphql`
  query {
      file(relativePath: { eq: "tree.jpg" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)
  return (
    <div className={classes.container}>
      <a
        href={data.slug}
        target={'_blank'}
        rel={'noreferrer'}
        className={classes.link}>
          {data.featuredImage ? <Img fluid={data.featuredImage.fluid} /> : null}
          <Typography variant='h2' color='textPrimary'>
            {data.title}
          </Typography>
      </a>
      <br/>
      <Typography
        variant='body1'
        dangerouslySetInnerHTML={{
          __html: data.excerpt.childMarkdownRemark.excerpt,
        }}
      />
      <br/>
      {data.featuredImage ? <hr/> : null}
      <br/>
    </div>
  )};

export default withStyles(styles)(BlogPost);