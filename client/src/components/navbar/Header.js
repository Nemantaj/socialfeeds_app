import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import Nav from "./nav";

function Header(props) {
  const location = useLocation();

  return (
    <Fragment>
      <div className="nav">{location.pathname !== "/accounts" && <Nav />}</div>
      <div className="app_body">{props.children}</div>
    </Fragment>
  );
}

export default Header;
