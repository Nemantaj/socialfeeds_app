import { Link, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { TbArrowBack } from "react-icons/tb";

function BackSettings() {
  const navigate = useNavigate();
  function goBackHandler(event) {
    event.preventDefault();
    navigate("/settings/main");
  }

  return (
    <Link to="/settings/main">
      <Button
        size="sm"
        rounded
        flat
        auto
        color="primary"
        onClick={goBackHandler}
      >
        <TbArrowBack />
      </Button>
    </Link>
  );
}

export default BackSettings;
