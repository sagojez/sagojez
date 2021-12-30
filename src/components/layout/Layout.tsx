import * as React from "react";
import "../../styles/global.css";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Layout = ({ children, ...rest }) => {
  return (
    <div>
      <Header />
      <main style={rest?.style}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
