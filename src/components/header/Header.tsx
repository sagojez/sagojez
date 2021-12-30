import { Link } from "gatsby";
import * as React from "react";
import { useState } from "react";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="header">
      <div className={`top-navigation-links ${isActive ? "show" : "hide"}`}>
        <Link
          to="/"
          activeClassName="navigation-link mobile-nav w--current"
          aria-current="page"
          className="navigation-link mobile-nav"
        >
          Articles
        </Link>
        <Link
          to="/about"
          activeClassName="navigation-link mobile-nav w--current"
          aria-current="page"
          className="navigation-link mobile-nav"
        >
          About
        </Link>

        <div
          onClick={() => setIsActive(!isActive)}
          data-w-id="315ba4c2-2944-5cbc-5e13-dc9894df5eff"
          className="close-menu-button"
        >
          <svg
            width="45"
            height="45"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.9515 0.0484642L0 40L4.94975 44.9497L44.9013 4.99821L39.9515 0.0484642Z"
              fill="#FFFFF6"
            />
            <path
              d="M44.9515 39.9515L5 0L0.0502526 4.94975L40.0018 44.9013L44.9515 39.9515Z"
              fill="#FFFFF6"
            />
          </svg>
        </div>
      </div>
      <Link
        id="w-node-_298f8677-ff79-da06-ab98-8ff254a241a1-1c421d3c"
        to="/"
        aria-current="page"
        className="logo-link-block w-inline-block w--current"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          className="image-2"
          width="30"
          height="35"
          viewBox="0 0 104.000000 115.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,115.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path d="M1025 575 c0 -319 1 -451 2 -293 2 158 2 419 0 580 -1 161 -2 32 -2 -287z" />
            <path d="M355 1121 c-39 -17 -95 -72 -95 -92 0 -4 -15 -16 -32 -25 -80 -40 -110 -90 -109 -179 0 -62 -1 -64 -34 -84 -50 -29 -79 -91 -79 -172 0 -57 4 -74 29 -115 17 -26 44 -54 63 -63 25 -12 31 -21 27 -36 -17 -66 -16 -101 7 -145 24 -47 77 -90 110 -90 11 0 30 -13 44 -29 31 -37 118 -81 160 -81 44 0 87 17 81 33 -2 8 -22 11 -63 9 -51 -3 -65 0 -98 23 -22 15 -48 37 -58 50 -10 13 -33 27 -51 31 -93 20 -131 106 -88 200 l19 42 -28 5 c-37 8 -90 54 -106 94 -36 84 -2 188 72 223 40 20 43 24 36 48 -4 15 -7 48 -7 74 0 58 24 93 86 126 24 12 46 28 48 35 9 28 45 68 73 83 19 10 56 16 95 16 62 0 89 12 62 29 -24 15 -122 9 -164 -10z" />
            <path d="M700 633 c0 -21 -54 -55 -74 -47 -9 3 -20 -4 -27 -17 -9 -17 -9 -24 0 -27 13 -4 15 -78 1 -87 -6 -3 -5 -15 2 -31 8 -17 17 -23 30 -18 37 11 38 -8 1 -38 -21 -16 -38 -34 -37 -39 1 -5 2 -13 3 -19 0 -5 14 -16 31 -25 l30 -15 -40 -36 c-68 -62 -48 -128 46 -153 124 -33 268 78 232 179 -14 43 -40 54 -143 60 -82 4 -90 7 -93 26 -2 11 4 27 13 34 14 11 17 10 22 -8 4 -16 13 -22 34 -22 19 0 29 5 29 15 0 17 56 49 74 42 18 -7 41 32 27 46 -15 15 -14 84 0 89 9 3 9 10 0 27 -7 13 -18 20 -27 17 -20 -8 -74 26 -74 47 0 12 -8 17 -30 17 -22 0 -30 -5 -30 -17z m85 -78 c53 -52 18 -135 -56 -135 -71 0 -105 85 -54 135 15 16 36 25 55 25 19 0 40 -9 55 -25z m29 -295 c38 -14 52 -51 36 -90 -16 -39 -56 -60 -115 -60 -38 0 -52 5 -76 29 -16 16 -29 37 -29 46 0 23 30 66 54 75 29 12 100 12 130 0z" />
            <path d="M175 615 c-31 -30 -32 -73 -4 -109 20 -26 22 -26 154 -26 158 0 185 -7 185 -49 0 -40 -23 -51 -104 -51 -52 0 -66 -3 -66 -15 0 -12 16 -15 83 -15 72 0 87 3 103 21 28 31 25 96 -5 120 -20 17 -41 19 -165 19 -153 0 -166 4 -166 52 0 41 25 48 159 48 101 0 121 2 121 15 0 13 -22 15 -135 15 -131 0 -137 -1 -160 -25z" />
          </g>
        </svg>
        {/* <svg
          className="image-2"
          width="18"
          height="23"
          viewBox="0 0 18 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.5079 11.4655C18.0845 10.8214 17.6273 9.79861 16.7628 9.79861H12.5886C12.0363 9.79861 11.5886 9.35089 11.5886 8.79861V1.50972C11.5886 0.586379 10.4441 0.156325 9.83604 0.851178L0.451378 11.5754C-0.114432 12.222 0.344736 13.2339 1.20392 13.2339H5.12379C5.67608 13.2339 6.12379 13.6817 6.12379 14.2339V21.5675C6.12379 22.4853 7.25677 22.9183 7.86891 22.2344L17.5079 11.4655Z"
            fill="black"
          />
        </svg> */}
      </Link>
      <div
        onClick={() => setIsActive(!isActive)}
        data-w-id="71467901-a466-4125-00Ho44-905be2e1fbfb"
        className="open-menu-button"
      >
        <svg
          className="menu-icon"
          width="57"
          height="27"
          viewBox="0 0 57 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M56.6401 0H0.140137V7H56.6401V0Z" fill="#FFFFF6" />
          <path
            d="M56.6401 19.08H0.140137V26.08H56.6401V19.08Z"
            fill="#FFFFF6"
          />
        </svg>
      </div>
      <div
        id="w-node-_2dfc81a7-fa7f-4cf8-fd21-00b91180d28c-1c421d3c"
        data-w-id="2dfc81a7-fa7f-4cf8-fd21-00b91180d28c"
        className="search-button"
      >
        <svg
          className="search-icon"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.8821 23.9281C29.525 24.5161 29.6353 25.3926 30.1128 25.8702L39.1213 34.8787C40.2929 36.0503 40.2929 37.9497 39.1213 39.1213C37.9497 40.2929 36.0503 40.2929 34.8787 39.1213L25.8702 30.1128C25.3856 29.6283 24.5123 29.5323 23.916 29.8886C23.916 29.8886 23.6953 30.0526 23.0022 30.3904C20.8873 31.4215 18.5112 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 18.5201 31.4174 20.9042 30.3794 23.0247C30.0442 23.7097 29.8821 23.9281 29.8821 23.9281ZM16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26Z"
            fill="#FFFFF6"
          />
        </svg>
      </div>
      <div className="search-modal-container">
        <form
          action="https://aspire-template.webflow.io/search"
          className="search-bar w-form"
        >
          <input
            type="search"
            className="search-field w-input"
            autoFocus
            maxLength={256}
            name="query"
            placeholder="Search…"
            id="search"
            required
          />
          <input
            type="submit"
            value="Search"
            className="submit-search-button w-button"
          />
        </form>
      </div>
      <div
        data-w-id="7f6271eb-4e46-d34f-de06-5a2ed8c3afa2"
        className="search-modal-background"
      ></div>
    </div>
  );
};

export default Header;
