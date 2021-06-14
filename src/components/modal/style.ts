const styles = ({ typography }) => ({
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
    backgroundColor: '#fafafa',
    width: '100%',
    height: '100%',
    // padding: '30px',
    borderRadius: '10px',
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
