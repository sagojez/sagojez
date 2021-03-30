import React from 'react';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Img from 'gatsby-image';

import styles from './style';

interface Props {
  classes: any;
  data: any;
};
console.log("HOLA")

const BlogPost = ({ classes, data }: Props) => (
  <div className={classes.container}>
    {data.featuredImage ? <Img fluid={data.featuredImage.fluid} /> : null}
    <Typography variant='h2' color='textPrimary'>
      {data.title}
    </Typography>
    <Typography
      variant='body1'
      dangerouslySetInnerHTML={{
        __html: data.excerpt.childMarkdownRemark.excerpt,
      }}
    />
    <br/>
    <hr/>
    <br/>
  </div>
);

export default withStyles(styles)(BlogPost);
