import React from 'react';

import { Layout, SEO } from 'components';
import { Projects } from 'containers';

const ProjectsPage = () => (
  <Layout>
    <SEO title='Projects' />
    <Projects />
  </Layout>
);

export default ProjectsPage;
