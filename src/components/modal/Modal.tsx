import React, { ReactElement, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import MUIlModal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { Scrollbars } from 'react-custom-scrollbars';
import { FaWindowClose } from 'react-icons/fa'

import styles from './style';

interface Props {
  classes: any;
  children: ReactElement;
  fullScreen: boolean;
  open: boolean;
  setOpen: () => {};
};

const Modal = ({ classes, children, fullScreen, setOpen, ...rest }: Props) => (
  <MUIlModal closeAfterTransition {...rest}>
    <Fade in={rest.open} timeout={250}>
      <div
        className={
          fullScreen ? classes.fullScreenContainer : classes.centeredContainer
        }>
        <div className={classes.content}>
          <FaWindowClose onClick = {() => setOpen()}/>
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            className={classes.scrollContainer}>
            {children}
          </Scrollbars>
        </div>
      </div>
    </Fade>
  </MUIlModal>
);

export default withStyles(styles)(Modal);
