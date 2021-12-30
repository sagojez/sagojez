import addToMailchimp from "gatsby-plugin-mailchimp";
import * as React from "react";
import { FormEvent, useState } from "react";

const Mail = () => {
  const [subscribed, setSubscribed] = useState({
    result: "",
    msg: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = (e.currentTarget.firstChild as any).value;
    if (value) {
      const result = await addToMailchimp(
        value,
        "",
        "https://samuelgomez.us17.list-manage.com/subscribe/post?u=656521d2f1d081db649218d01&amp;id=2516fdb8e9"
      );

      if (result.result === "success") {
        setSubscribed({
          result: "success",
          msg: "Thanks for subscribing!",
        });
      } else {
        setSubscribed({
          result: "error",
          msg: "Something went wrong, please try again.",
        });
      }
    }
  };

  return (
    <div className="section wf-section">
      <div className="main-container center-align">
        <div className="call-to-action-container">
          <h2 className="inverted-color">Want to receive emails?</h2>
          <div className="inverted-color">
            Sign up to get an email every time a new blog is published.
          </div>
          <div className="email-signup-form w-form">
            <form
              onSubmit={handleSubmit}
              id="wf-form-Email-Sign-up"
              name="wf-form-Email-Sign-up"
              data-name="Email Sign-up"
              method="get"
              className="signup-form-container"
            >
              <input
                type="email"
                className="email-field w-input"
                maxLength={256}
                name="Email-Address"
                data-name="Email Address"
                placeholder="Enter your email"
                id="Email-Address"
                required
              />
              <input
                type="submit"
                value="Submit"
                data-wait="Please wait..."
                className="submit-button w-button"
              />
            </form>
            <div
              className={`success-message w-form-done ${
                subscribed.result === "success" ? "show" : "hide"
              }`}
            >
              <div>Thanks!</div>
            </div>
            <div
              className={`error-message w-form-fail ${
                subscribed.result === "error" ? "show" : "hide"
              }`}
            >
              <div>Oops! Something went wrong.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mail;
