import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppWidgets from '../../WidgetManagement/RenderAppWidgets';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  width: "100%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  color: "white",
  p: 4,
};

export default function ButtonWithModal({ title, content, faIcon }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const id = title && title.replace(" ", "-")
  return (
    <div style={{ margin: "auto", height: "100%" }}>
      <Button onClick={handleOpen} style={{ height: "100%" }}>
        {faIcon && <i className={"fa-2xl fas fa-" + faIcon} size="3x" style={{ marginRight: "5px" }}></i>}
        {title}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby={"modal-" + id + "-title"}
        aria-describedby={"modal-" + id + "-description"}
      >
        <Box sx={style}>
          <Button onClick={handleClose} style={{ float: "right", zIndex: 100 }}><FontAwesomeIcon size="xl" icon={faClose} /></Button>
          {content && <AppWidgets layout={content} />}
          {/* <Button variant="contained" onClick={handleClose}>Close</Button> */}
        </Box>
      </Modal>
    </div>
  );
}