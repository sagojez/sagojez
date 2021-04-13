import { Link } from 'gatsby';
import React from 'react';
import { withStyles } from '@material-ui/styles';

import { Avatar, Navigation, Animated } from 'components';

import styles from './style';
interface Props {
  classes: any;
};

const Resume = ({ classes }: Props) => (
  <div className= {classes.container}>
    <div className={classes.rectangleLarge}>
      Hello
    </div>
    <div className={classes.rectangleSmall}>
      
    </div>
  </div>
);

export default withStyles(styles)(Resume);