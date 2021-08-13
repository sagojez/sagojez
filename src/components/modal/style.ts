const styles = ({  app, breakpoints, typography  }) => ({
  scrollContainer: {
    minHeight: '100%',
  },
  fullScreenContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centeredContainer: {
    width: '80%',
    height: '90%',
    position: 'absolute',
    top: '5%',
    left: '10%',
    outline: 'none',
  },
  content: {
    height: '100%',
    borderRadius: '10px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: 'inherit'
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '18px',
    cursor: 'pointer',
  },
});

export default styles;
