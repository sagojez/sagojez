export const languages = [
  { name: 'c', level: 'advanced' },
  { name: 'javascript', level: 'advanced' },
  { name: 'python', level: 'advanced' },
  { name: 'scala', level: 'intermediate' },
  { name: 'SQL', level: 'advanced' },
  { name: 'swift', level: 'intermediate' },
];

export const frameworks = [
  { name: 'react', level: 'advanced' },
  { name: 'serverless', level: 'advanced' },
  { name: 'spark', level: 'intermediate' },
];

export const appliedKnowledge = [
  { name: 'backend development', level: 'advanced' },
  { name: 'frontend development', level: 'advanced' },
  { name: 'machine learning', level: 'intermediate' },
];

export const langData = [
  {
    languages: languages.map(item => {
      return { name: item.name, level: item.level };
    }),
  },
  {
    frameworks: frameworks.map(item => {
      return { name: item.name, level: item.level };
    }),
  },
  {
    appliedKnowledge: appliedKnowledge.map(item => {
      return { name: item.name, level: item.level };
    }),
  },
];

export const education = [
  {
    school: 'HOLBERTON',
    profession: 'Software Engineer',
    date: 'Jan 2020 - Nov 2020 I Barranquilla, CO',
  },
  {
    school: 'UNIVERSIDAD DEL NORTE',
    profession: 'B.Sc. IN Electronic Engineering',
    date: 'Jan 2015 - Mar 2020 I Barranquilla, CO',
  },
];

export const experience = [
  {
    company: 'Senior Software Engineer, Torre',
    date: '2020 – Present',
    desc: [
      'Maintained and optimized the next-generation platform for finding fulfilling jobs using Machine Learning to match job seekers with opportunities.',
      'Developed and maintained a distributed system with Scala, Akka, Akka Actors, and Play Framework adding new functionalities to the platform to ensure the best customer experience.',
      'Developed tests (written in Scala) to prevent quality regressions and to improve reliability in the platform.',
    ],
    technologies: '',
  },
  {
    company: 'Cloud/Data Engineer, Morris&Opazo',
    date: '2020 - 2021',
    desc: [
      'Maintained and optimized an existing big data pipeline developed with Apache Spark.',
      'Developed an ETL pipeline AWS EMR which consisted of data cleaning and partitioning in order to fuel the data lake used in critical downstream services to provide valuable insights to clients.',
    ],
    technologies: '',
  },
  {
    company: 'Software Engineer, SC IT Services (Clean news)',
    date: '2020 - 2021',
    desc: [
      'Developed and maintained a fully scalable backend with NodeJs, AWS Lambda, AWS Cognito, AWS SNS, and React to maximize business value and developers’ ease at coding.',
      'Co-architected and implemented a web scraping application with Golang in order to extract relevant/segmented news from Wikipedia and Google News to serve relevant data to customers based on geographical location.',
      'Co-architected and implemented a Machine Learning pipeline with AWS to extract the news, process them, and return relevant data to the user.',
    ],
    technologies: '',
  },
  {
    company: 'Co-Founder, Pakud',
    date: '2018 – 2020',
    desc: [
      'Developed a fully-featured application (with AWS services, Firebase for real-time chat and React) to connect buyers with providers in Colombia.',
      'Debugged, diagnosed, and troubleshot some issues with architectural problems that could lead to unnecessary use of AWS services.',
      'Developed, debugged, diagnosed, and troubleshot issues with overall platform tests in order to ensure functionality and quality.',
      'Introduced the company project to a larger company in order to fund the project and hire new engineers to help the platform launch.',
    ],
    technologies: '',
  },
  {
    company: 'Software Developer, Freelance',
    date: '2018 – 2020',
    desc: [
      'Developed a fully-featured application (with AWS services, Firebase for real-time chat and React) to connect buyers with providers in Colombia.',
      'Debugged, diagnosed, and troubleshot some issues with architectural problems that could lead to unnecessary use of AWS services.',
      'Developed, debugged, diagnosed, and troubleshot issues with overall platform tests in order to ensure functionality and quality.',
      'Introduced the company project to a larger company in order to fund the project and hire new engineers to help the platform launch.',
    ],
    technologies: '',
  },
];
