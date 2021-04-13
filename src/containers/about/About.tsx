import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';

import { Animated, LinkList, Resume, Modal } from 'components';

import content from './content';

const { title, subtitle, links } = content;

const About = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fade in timeout={1000}>
        <Typography onClick={() => setOpen(true)} variant='h1' color='textPrimary'>
          <Animated>{title}</Animated>
        </Typography>
      </Fade>
      <Modal open={open} setOpen={() => setOpen(false)}>
        <Resume/>
      </Modal>
      <Typography variant='h3' color='textPrimary'>
        {subtitle}
      </Typography>
      <LinkList links={links} />
    </>
  )
};

export default About;
