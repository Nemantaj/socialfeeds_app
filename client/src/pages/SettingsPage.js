import { Text } from "@nextui-org/react";
import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";

import MainSettings from "./settings/Main";
import ProfileImage from "./settings/ChangeProfile";
import ChangePassword from "./settings/ChangePassword";
import ChangeUserInfo from "./settings/ChangeUserInfo";
import ChangeUserBio from "./settings/ChangeUserBio";

import "./SettingsPage.css";

function SettingsPage() {
  return (
    <motion.div
      initial={{ y: "25%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
      }}
      className="settings_home_styles"
    >
      <div className="settings_home_head">
        <Text h2>Settings</Text>
      </div>
      <Routes>
        <Route path="main" element={<MainSettings />} />
        <Route path="main/change-profile" element={<ProfileImage />} />
        <Route path="main/change-showcase" element={<ProfileImage />} />
        <Route path="main/change-password" element={<ChangePassword />} />
        <Route path="main/change-user-info" element={<ChangeUserInfo />} />
        <Route path="main/change-user-bio" element={<ChangeUserBio />} />
      </Routes>
    </motion.div>
  );
}

export default SettingsPage;
