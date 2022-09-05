import { Button } from "@nextui-org/react";
import { Fragment, useRef } from "react";
import { TbUpload } from "react-icons/tb";

import "./FileUpload.css";

function FileUpload(props) {
  const fileInput = useRef(null);

  function handleClick(event) {
    fileInput.current.click();
  }

  function handleChange(event) {
    const fileUploaded = event.target.files;
    props.onUpload(fileUploaded);
  }

  return (
    <Fragment>
      <Button flat rounded auto color="secondary" onClick={handleClick}>
        <TbUpload />
        &nbsp; Upload
      </Button>
      <input
        id="file_input"
        className="file_up_input"
        ref={fileInput}
        onChange={handleChange}
        type="file"
      />
    </Fragment>
  );
}

export default FileUpload;
