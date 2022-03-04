import { Snackbar as S } from "@material-ui/core";

export default function Snackbar({ open, handleClose, children, className }) {
  return (
    <S
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      message={children}
      autoHideDuration={6000}
      onClose={handleClose}
      className={className}
    />
  );
}
