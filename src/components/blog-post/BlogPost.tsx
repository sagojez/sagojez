import React from 'react';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Img from 'gatsby-image';

import styles from './style';

interface Props {
  classes: any;
  data: any;
};

const BlogPost = ({ classes, data }: Props) => (
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
