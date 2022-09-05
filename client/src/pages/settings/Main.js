import { Fragment } from "react";
import { Divider, Text, Avatar, Button } from "@nextui-org/react";
import { TbLock, TbUser, TbInfoSquare } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Logout from "../../components/auth/Logout";

function MainSettings() {
  const profileData = useSelector((state) => state.auth.profileData);
  return (
    <Fragment>
      {profileData !== null && (
        <Fragment>
          <div className="settings_content">
            <Link to="change-profile" className="settings_profile">
              <Text h5>Change profile picture.</Text>
              <Avatar
                squared
                src={`https://socialfeedsapp.herokuapp.com/${profileData.img}`}
                css={{ p: 0 }}
              />
            </Link>
            <Divider />
            <Link to="change-showcase" className="settings_profile">
              <Text h5>Change showcase picture.</Text>
              <Avatar
                squared
                src={`https://socialfeedsapp.herokuapp.com/${profileData.imgShowcase}`}
                css={{ p: 0 }}
              />
            </Link>
            <Divider />
            <Link to="change-password" className="settings_profile">
              <Text h5>Change your password.</Text>
              <Avatar
                squared
                icon={<TbLock color="#F31260" />}
                css={{ p: 0 }}
              />
            </Link>
            <Divider />
            <Link to="change-user-info" className="settings_profile">
              <Text h5>Edit user info.</Text>
              <Avatar
                squared
                icon={<TbUser color="#06B7DB" />}
                css={{ p: 0 }}
              />
            </Link>
            <Divider />
            <Link to="change-user-bio" className="settings_profile">
              <Text h5>Edit user bio and work.</Text>
              <Avatar
                squared
                icon={<TbInfoSquare color="#17C964" />}
                css={{ p: 0 }}
              />
            </Link>
            <Divider />
            <Logout />
          </div>
          <div className="about_app">
            <Text
              h4
              css={{
                mt: "20px",
                textGradient: "45deg, $red600 -20%, $pink600 100%",
                mb: " 5px",
              }}
            >
              Socialfeeds v2.0.0{" "}
            </Text>
            <Text
              size="14px"
              color="$pink800"
              css={{
                bgColor: "$pink300",
                br: "20px",
                py: "5px",
                px: "10px",
                w: "fit-content",
                mb: "100px",
              }}
            >
              &copy; All rights reserved. Made by Nemantaj Garg.
            </Text>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default MainSettings;
