const styles = ({ app, typography }) => ({
    container: {
        paddind: '30px',
        boxSizing: 'border-box',
        borderRadius: '10px'
    },
    logo: {
        border: 'none',
        float: 'left',
        transition: 'all .3s',
        textDecoration: 'none',
    },
    rectangleLarge: {
        width: '40%',
        float: 'left',
        padding: '15px',
        background: '#424848',
        borderRadius: '6px',
        height: '452px',
        maxWidth: '325px',
        margin: '10px'
    },
    rectangleSmall: {
        width: '60%',
        float: 'left',
        padding: '15px',
        maxWidth: '659px',
        height: '133px',
        background: '#E5E5E5',
        borderRadius: '6px',
        margin: '10px'
    }
});

export default styles;