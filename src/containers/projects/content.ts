import { FaGithub, FaTwitter } from 'react-icons/fa';

const content = [
    {
      link: 'https://github.com/samgj18/human-activity-recognition',
      excerpt: {
        childMarkdownRemark: {
          excerpt: "This project was done as part of the thesis for the electronic engineering program of the Universidad del Norte. The technologies that were used were Django for the backend, react native for the frontend and python for data processing. "
        }
      },
      slug: "https://github.com/samgj18/human-activity-recognition",
      title: "Harke",
    },
    {
      link: 'https://github.com/samgj18/cards-game',
      excerpt: {
        childMarkdownRemark: {
          excerpt: "This application spins up a server that allows a client to play a single card game. Is written in a pure functional way using cats, fs2, circe and http4s."
        }
      },
      slug: "https://github.com/samgj18/cards-game",
      title: "Cards Game",
    },
    {
      link: 'https://github.com/samgj18/worldbank-cli',
      excerpt: {
        childMarkdownRemark: {
          excerpt: "This application performs data ingestion from Worldbank API and executes data queries to print to the console the results of the top 10 countries by population growth from 2010 to 2018 and the top 3 countries by GDP growth in the same range. Is written in a pure functional way using Cats, doobie, fs2 and h2."
        }
      },
      slug: "https://github.com/samgj18/worldbank-cli",
      title: "Worldbank CLI",
    },
    {
      link: 'https://github.com/samgj18/books-api',
      excerpt: {
        childMarkdownRemark: {
          excerpt: "This application is an example of how to use newtypes and refined types with http4s and circe to create a CRUD for books. Is written in a pure functional way using cats, fs2, circe, derevo, newtypes, refined, doobie and http4s"
        }
      },
      slug: "https://github.com/samgj18/books-api",
      title: "Books API",
    },
  ];



export default content;
