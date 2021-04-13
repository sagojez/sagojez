import { Link } from 'gatsby';
import React from 'react';
import { withStyles } from '@material-ui/styles';

import { Avatar, Navigation, Animated } from 'components';

import styles from './style';
interface Props {
  classes: any;
};

const Resume = ({ classes }: Props) => (
  <div >
    Resume
  </div>
);

export default withStyles(styles)(Resume);