import { useState } from "react";

import { Button, Text, Loading, Avatar } from "@nextui-org/react";
import { TbLogout } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { postActions } from "../../store/posts-slice";

import "./Logout.css";

function Logout(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function logoutHandler(event) {
    setLoading(true);
    event.preventDefault();

    dispatch(authActions.setToken(null));
    dispatch(authActions.setUserId(null));
    dispatch(authActions.setAuth());
    dispatch(authActions.setProfileData(null));
    dispatch(postActions.setStoredPosts([]));
    dispatch(postActions.setStoredStories([]));
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoading(false);
  }

  return (
    <div className="logout" onClick={logoutHandler}>
      <Text h5>Sign out of your account.</Text>
      <Avatar
        squared
        icon={
          !loading ? <TbLogout color="#7828C8" /> : <Loading type="spinner" />
        }
        css={{ p: 0 }}
      />
    </div>
  );
}

export default Logout;
