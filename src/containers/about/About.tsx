import React, { useState } from 'react';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/styles';

import Typography from '@material-ui/core/Typography';
import { Animated, LinkList, Modal, Resume } from 'components';
import content from './content';
import styles from './style';

const { title, subtitle, links } = content;

interface Props {
  classes: any;
}

const About = ({ classes }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fade in timeout={1000}>
        <Typography
          className={classes.linkable}
          onClick={() => setOpen(!open)}
          variant='h1'
          color='textPrimary'>
          <Animated>{title}</Animated>
        </Typography>
      </Fade>
      <Modal open={open} setOpen={setOpen}>
        <Resume />
      </Modal>
      <Typography variant='h3' color='textPrimary'>
        {subtitle}
      </Typography>
      <LinkList links={links} />
    </>
  );
};

export default withStyles(styles)(About);
