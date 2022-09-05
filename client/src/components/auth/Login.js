import { Card, Text, Input, Button, Link } from "@nextui-org/react";
import { Fragment } from "react";
import { TbMail, TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import { motion } from "framer-motion";

import useInput from "../../hooks/useInput";

import ErrorMessage from "./ErrorMessage";

import "./Login.css";

function LoginCard(props) {
  let formValid = false;

  const {
    inputValue: emailValue,
    error: emailError,
    isValid: emailValid,
    inputHandler: emailHandler,
    blurHandler: emailBlur,
  } = useInput((value) => value !== "" && value.includes("@"));

  const {
    inputValue: passValue,
    error: passError,
    isValid: passValid,
    inputHandler: passHandler,
    blurHandler: passBlur,
  } = useInput((value) => value !== "" && value.length >= 8);

  formValid = emailValid && passValid;

  function submitHandler(event) {
    event.preventDefault();

    const userInfo = {
      email: emailValue,
      password: passValue,
    };

    console.log(userInfo);

    props.loginHandle(userInfo);
  }

  return (
    <Fragment>
      <motion.div
        initial={{ y: "25%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="lg_info_text"
      >
        <Text h3 css={{ textGradient: "45deg, $red600 -20%, $pink600 100%" }}>
          Log in to your SocialFeeds account.
        </Text>
      </motion.div>
      <motion.div
        initial={{ y: "25%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card_parent"
      >
        <Card variant="shadow" css={{ mt: "20px", mw: "550px" }}>
          <form className="lg_form" onSubmit={submitHandler}>
            <Input
              type="email"
              onChange={emailHandler}
              onBlur={emailBlur}
              placeholder="Email address"
              bordered
              aria-label="Email"
              contentLeft={<TbMail />}
              contentLeftStyling={true}
              clearable
            />
            {emailError && <ErrorMessage text="Enter a valid email address." />}
            <Input.Password
              type="password"
              onChange={passHandler}
              onBlur={passBlur}
              placeholder="Password"
              css={{ mt: "15px" }}
              bordered
              aria-label="Password"
              contentLeft={<TbLock />}
              contentLeftStyling={true}
              clearable
              visibleIcon={<TbEyeOff />}
              hiddenIcon={<TbEye />}
            />
            {passError && (
              <ErrorMessage text="Password should atleast be 8 characters." />
            )}
            <Button
              color="error"
              css={{ mt: "20px" }}
              disabled={!formValid}
              type="submit"
              rounded
            >
              Log In
            </Button>
          </form>
          <Card.Footer className="lg_footer">
            <Link onClick={props.onAccount}>
              <Text
                color="secondary"
                css={{ pb: "5px", borderBottom: "1px solid $purple600" }}
              >
                Create a new SocialFeeds account.
              </Text>
            </Link>
          </Card.Footer>
        </Card>
      </motion.div>
    </Fragment>
  );
}

export default LoginCard;
