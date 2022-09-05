import { Fragment, useState, memo } from "react";
import { Divider, Text, Button, Image } from "@nextui-org/react";
import { TbArrowBack } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import FileUpload from "../../components/UI/FileUpload";

function ProfileImage() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });
  const [img, setImg] = useState(null);
  const profileData = useSelector((state) => state.auth.profileData);

  function handleChange(img) {
    if (
      img[0].type === "image/jpeg" ||
      img[0].type === "image/jpg" ||
      img[0].type === "image/png"
    ) {
      setError({
        value: false,
        msg: "",
      });
      setImage(img[0]);
      return setImg(URL.createObjectURL(img[0]));
    }
    console.log(img[0].type);
    return setError({
      value: true,
      msg: "Incorrect file type! Supported file types are 'png' 'jpg' 'jpeg'.",
    });
  }
  return (
    <Fragment>
      <div className="settings_home_bar">
        <Text
          color="$pink800"
          size="14px"
          css={{ bgColor: "$pink300", br: "20px", py: "5px", px: "10px" }}
        >
          Change profile picture.
        </Text>
        <Link to="/settings/main">
          <Button size="sm" rounded flat auto color="primary">
            <TbArrowBack />
          </Button>
        </Link>
      </div>
      <Divider />
      <div className="settings_profile_img">
        <motion.form
          initial={{ y: "50%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="settings_img_form"
        >
          <div className="settings_file">
            <FileUpload onUpload={handleChange} />
            <Text size="14px" css={{ ml: "5px" }}>
              Upload an image.
            </Text>
          </div>
          {img !== null && !error.value && (
            <Image className="new_img_preview" src={img} />
          )}
        </motion.form>
      </div>
    </Fragment>
  );
}

export default memo(ProfileImage);
