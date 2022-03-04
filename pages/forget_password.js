import Head from "next/head";
import Image from "next/image";
import { appName } from "../globals";
import styles from "../styles/ForgetPassword.module.css";
import {
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import useHit from "../components/useHit";
import useAuth from "../components/useAuth";
import Loading from "../components/loading";
import Snackbar from "../components/snackbar";

export default function Login() {
  const maxWidth = useMediaQuery("(max-width: 832px)");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = useHit();
  const auth = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn()) {
      window.location.href = "/";
    } else {
      setVisible(true);
    }
  }, [auth]);

  function forgetPassword(e) {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    sendRequest("forget_password", {
      email,
    })
      .then((c) => {
        setIsLoading(false);
        setSuccess(c.message);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }

  return (
    <>
      <Head>
        <title>Forget Password - {appName}</title>
      </Head>
      {visible && (
        <>
          <div className={styles.main}>
            <div className={styles.container}>
              <Typography variant="h4" className={styles.heading}>
                Forget Password
              </Typography>
              <form onSubmit={forgetPassword}>
                <TextField
                  type="email"
                  variant="outlined"
                  color="primary"
                  label="Email"
                  required
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.yash}
                >
                  Reset Password
                </Button>
                <div className={styles.or}>
                  <div className={styles.line}></div>
                  <Typography variant="body1" className={styles.orTxt}>
                    OR
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  className={styles.registerBtn}
                  href="/login"
                >
                  Login
                </Button>
              </form>
            </div>
            {!maxWidth && (
              <div className={styles.img}>
                <Image
                  src="/assets/forget_password/hero.svg"
                  alt="Login Illustration"
                  layout="fill"
                />
              </div>
            )}
          </div>
          <div className={styles.wave}></div>
          <Snackbar open={Boolean(success)}>{success}</Snackbar>
          <Snackbar open={Boolean(error)}>{error}</Snackbar>
          <Loading open={isLoading} />
        </>
      )}
    </>
  );
}
