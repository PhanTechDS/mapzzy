import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import styles from "../styles/components/loading.module.css";

export default function Loading({ txt, open }) {
  return (
    <Dialog open={open} className={styles.loading}>
      <DialogContent className={styles.content}>
        <CircularProgress color="primary" size={48} className={styles.loader} />
        <Typography variant="h5" className={styles.txt}>
          {txt || "Loading..."}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
