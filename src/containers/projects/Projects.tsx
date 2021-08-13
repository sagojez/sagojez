import React from 'react';
import { withStyles } from '@material-ui/styles';

import { BlogPost } from 'components';
import content from './content';
import styles from './style';

interface Props {
  classes: any;
}

const Projects = ({ classes }: Props) => {

  return (
    <div className={classes.container}>
        {content.map((data) => (
            <BlogPost key={"id"+data.title} data={data} />
        ))}
    </div>
  );
};

export default withStyles(styles)(Projects);
