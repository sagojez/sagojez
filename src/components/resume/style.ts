const styles = ({ app, breakpoints, typography }) => ({
  container: {
    boxSizing: 'border-box',
    borderRadius: '10px',
    display: 'grid',
    gridTemplateColumns: '45% 55%',
    gridTemplateRows: 'auto',
    flexDirection: 'row',
    background: '#696969',
    color: 'white',
    padding: '50px 65px 50px 65px',

    [breakpoints.down('lg')]: {
      gridTemplateColumns: '35% 65%',
    },

    [breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },

    [breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
  },
  logo: {
    border: 'none',
    float: 'left',
    transition: 'all .3s',
    textDecoration: 'none',
  },
  firstColumn: {
    marginRight: '30px',
    display: 'flex',
    flexDirection: 'column',

    [breakpoints.down('sm')]: {
      marginRight: '0px',
    },

    [breakpoints.down('md')]: {
      marginRight: '0px',
    },
  },
  progLangSection: {
    marginBottom: '5px',
  },
  sectionHeader: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '17px',
    marginBottom: '9px',
    textTransform: 'uppercase',

    [breakpoints.down('md')]: {
      fontSize: '16px',
    },

    [breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  rectangleLarge: {
    width: '100%',
    height: '100%',
    background: '#424848',
    borderRadius: '6px',
    padding: '16px 19px 16px 19px',
  },
  sectionText: {
    fontFamily: 'Poppins',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '0',
    marginBottom: '4px',
    textTransform: 'capitalize',

    [breakpoints.down('md')]: {
      fontSize: '16px',
    },

    [breakpoints.down('ms')]: {
      fontSize: '14px',
    },
  },
  institution: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '4px',
    textTransform: 'uppercase',

    [breakpoints.down('md')]: {
      fontSize: '14px',
    },

    [breakpoints.down('ms')]: {
      fontSize: '12px',
    },
  },
  profession: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    marginTop: '0',
    marginBottom: '4px',
    textTransform: 'capitalize',

    [breakpoints.down('md')]: {
      fontSize: '12px',
    },

    [breakpoints.down('ms')]: {
      fontSize: '11px',
    },
  },
  date: {
    fontFamily: 'Poppins',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    marginTop: '0',
    marginBottom: '4px',

    [breakpoints.down('md')]: {
      fontSize: '11px',
    },
  },
  rectangleSmall: {
    width: '60%',
    float: 'left',
    padding: '15px',
    maxWidth: '659px',
    height: '133px',
    background: '#E5E5E5',
    borderRadius: '6px',
    margin: '10px',
  },
  expSection: {
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    marginBottom: '35px',
    padding: '20px 15px 20px 15px',

    [breakpoints.up('md')]: {
      marginBottom: '20px',
    },
  },
  company: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '1px',
    textTransform: 'uppercase',

    [breakpoints.down('md')]: {
      fontSize: '14px',
    },
  },
  expDate: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    marginTop: '0',
    marginBottom: '13px',

    [breakpoints.down('md')]: {
      fontSize: '12px',
    },
  },
  desc: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    marginTop: '0',
    marginBottom: '13px',

    [breakpoints.down('md')]: {
      fontSize: '12px',
    },
  },
});

export default styles;
