import { Card, Text, Input, Button, Link, Loading } from "@nextui-org/react";
import { Fragment } from "react";
import useInput from "../../hooks/useInput";
import { TbMail, TbUserCircle, TbLock, TbEye, TbEyeOff } from "react-icons/tb";
import { motion } from "framer-motion";

import ErrorMessage from "./ErrorMessage";

import "./Login.css";

function SignUpCard(props) {
  let formValid = false;

  const {
    inputValue: fNameValue,
    error: fNameError,
    isValid: fNameValid,
    inputHandler: fNameHandler,
    blurHandler: fNameBlur,
    clearInput: fNameClear,
  } = useInput((value) => value !== "" && value.length >= 1);

  const {
    inputValue: lNameValue,
    error: lNameError,
    isValid: lNameValid,
    inputHandler: lNameHandler,
    blurHandler: lNameBlur,
    clearInput: lNameClear,
  } = useInput((value) => value !== "" && value.length >= 1);

  const {
    inputValue: emailValue,
    error: emailError,
    isValid: emailValid,
    inputHandler: emailHandler,
    blurHandler: emailBlur,
    clearInput: emailClear,
  } = useInput((value) => value !== "" && value.includes("@"));

  const {
    inputValue: emailCValue,
    error: emailCError,
    isValid: emailCValid,
    inputHandler: emailCHandler,
    blurHandler: emailCBlur,
    clearInput: emailCClear,
  } = useInput((value) => value !== "" && value === emailValue);

  const {
    inputValue: passValue,
    error: passError,
    isValid: passValid,
    inputHandler: passHandler,
    blurHandler: passBlur,
    clearInput: passClear,
  } = useInput((value) => value !== "" && value.length >= 8);

  const {
    inputValue: passCValue,
    error: passCError,
    isValid: passCValid,
    inputHandler: passCHandler,
    blurHandler: passCBlur,
    clearInput: passCClear,
  } = useInput((value) => value !== "" && value === passValue);

  formValid =
    fNameValid &&
    lNameValid &&
    emailValid &&
    emailCValid &&
    passValid &&
    passCValid;

  function submitHandler(event) {
    event.preventDefault();

    const userInfo = {
      fname: fNameValue,
      lname: lNameValue,
      email: emailCValue,
      password: passValue,
    };

    props.authHandle(userInfo);
    fNameClear();
    lNameClear();
    emailClear();
    emailCClear();
    passClear();
    passCClear();

    // const res = await fetch('https://socialfeedsapp.herokuapp.com/signup', {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: {
    //     userData: userInfo
    //   }
    // });

    // if(!res.ok){
    //   console.log('problem fetching')
    // }

    // const data = await res.json();
    // console.log(data);
  }

  return (
    <Fragment>
      <motion.div
        initial={{ y: "25%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="lg_info_text"
      >
        <Text h3 css={{ textGradient: "45deg, $red600 -20%, $pink600 100%" }}>
          Create a new SocialFeeds account.
        </Text>
      </motion.div>
      <motion.div
        initial={{ y: "25%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card_parent"
      >
        <Card
          css={{ mt: "20px", mw: "550px" }}
          className="signup_card"
          variant="shadow"
        >
          <form className="lg_form" onSubmit={submitHandler}>
            <Input
              type="text"
              onChange={fNameHandler}
              onBlur={fNameBlur}
              placeholder="First Name"
              bordered
              aria-label="First Name"
              contentLeft={<TbUserCircle />}
              contentLeftStyling={true}
              clearable
              value={fNameValue}
            />
            {fNameError && <ErrorMessage text="First name is required!" />}
            <Input
              type="text"
              onChange={lNameHandler}
              onBlur={lNameBlur}
              placeholder="Last Name"
              bordered
              css={{ mt: "15px" }}
              aria-label="Last Name"
              contentLeft={<TbUserCircle />}
              contentLeftStyling={true}
              clearable
              value={lNameValue}
            />
            {lNameError && <ErrorMessage text="Last name is required!" />}
            <Input
              type="email"
              placeholder="Email Address"
              onChange={emailHandler}
              onBlur={emailBlur}
              bordered
              css={{ mt: "15px" }}
              aria-label="Email"
              contentLeft={<TbMail />}
              contentLeftStyling={true}
              clearable
              value={emailValue}
            />
            {emailError && <ErrorMessage text="Enter a valid email address." />}
            <Input
              type="email"
              onChange={emailCHandler}
              onBlur={emailCBlur}
              placeholder="Confirm Email Address"
              bordered
              css={{ mt: "15px" }}
              aria-label="Confirm Email"
              contentLeft={<TbMail />}
              contentLeftStyling={true}
              clearable
              value={emailCValue}
            />
            {emailCError && (
              <ErrorMessage text="Please confirm your email address." />
            )}
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
              value={passValue}
            />
            {passError && (
              <ErrorMessage text="Password should be more or equal to 8 charaters." />
            )}
            <Input.Password
              type="password"
              onChange={passCHandler}
              onBlur={passCBlur}
              placeholder="Confirm Password"
              css={{ mt: "15px" }}
              bordered
              aria-label="Confirm Password"
              contentLeft={<TbLock />}
              contentLeftStyling={true}
              clearable
              visibleIcon={<TbEyeOff />}
              hiddenIcon={<TbEye />}
              value={passCValue}
            />
            {passCError && (
              <ErrorMessage text="Please confirm your password." />
            )}
            <Button
              color="error"
              css={{ mt: "20px" }}
              type="submit"
              disabled={!formValid}
              rounded
            >
              {props.isLoading && <Loading type="spinner" />}
              {!props.isLoading && "Create account"}
            </Button>
          </form>
          <Card.Footer className="lg_footer">
            <Link onClick={props.onAccount}>
              <Text
                color="secondary"
                css={{ pb: "5px", borderBottom: "1px solid $purple600" }}
              >
                Log In to your SocialFeeds account.
              </Text>
            </Link>
          </Card.Footer>
        </Card>
      </motion.div>
    </Fragment>
  );
}

export default SignUpCard;
