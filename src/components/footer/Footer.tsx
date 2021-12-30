import * as React from "react";
import Mail from "../mail/Mail";

const Footer = () => {
  return (
    <div>
      <Mail />
      <div className="footer">
        <div className="footer-link-container">
          <div className="copyright-text">©Our Space</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
