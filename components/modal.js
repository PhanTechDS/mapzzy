import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "../styles/components/modal.module.css";
import { IconButton, Icon } from "@material-ui/core";

export default function Modal({ open, children, onClose, className }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.modal + " " + className}
        >
          <div className={styles.close}>
            <IconButton onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </div>
          <div className={styles.content}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
