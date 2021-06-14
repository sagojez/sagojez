import React, { ReactElement, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import MUIlModal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { Scrollbars } from 'react-custom-scrollbars';
import { FaWindowClose } from 'react-icons/fa';

import styles from './style';
import useComponentVisible from '../../hooks/useComponentVisible';
interface Props {
  classes: any;
  children: ReactElement;
  fullScreen: boolean;
  open: boolean;
  setOpen: (state: boolean) => {};
}

const Modal = ({ classes, children, fullScreen, setOpen, ...rest }: Props) => {
  const { ref, isComponentVisible } = useComponentVisible(rest.open);

  useEffect(() => {
    if (isComponentVisible) {
      setOpen(false);
    }
  }, [rest]);
  return (
    <div>
      {!isComponentVisible && (
        <MUIlModal closeAfterTransition {...rest}>
          <Fade in={rest.open} timeout={250} ref={ref}>
            <div
              className={
                fullScreen
                  ? classes.fullScreenContainer
                  : classes.centeredContainer
              }>
              <div className={classes.content}>
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
      )}
    </div>
  );
};

export default withStyles(styles)(Modal);
