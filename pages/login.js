import Head from "next/head";
import Image from "next/image";
import { appName } from "../globals";
import styles from "../styles/Login.module.css";
import {
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Loading from "../components/loading";
import useHit from "../components/useHit";
import Snackbar from "../components/snackbar";
import useAuth from "../components/useAuth";

export default function Login() {
  const maxWidth = useMediaQuery("(max-width: 832px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const sendRequest = useHit();
  const auth = useAuth();
  const [isVisible,setVisible] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn()) {
      window.location.href = "/";
    }
    else{
      setVisible(true);
    }
  }, [auth]);

  function login(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    sendRequest("login", {
      email,
      password,
    })
      .then((r) => {
        setIsLoading(false);
        setSuccess("Login successful");
        auth.login(r.message.token);
        window.location.href = "/";
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }

  return (
    <>
      <Head>
        <title>Login - {appName}</title>
      </Head>
      {isVisible && (
        <>
          <div className={styles.main}>
            <div className={styles.container}>
              <Typography variant="h4" className={styles.heading}>
                Login
              </Typography>
              <form onSubmit={login}>
                <TextField
                  type="email"
                  variant="outlined"
                  color="primary"
                  label="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
                <div className={styles.input}>
                  <TextField
                    type="password"
                    variant="outlined"
                    color="primary"
                    label="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.pass}
                  />
                  <a href="/forget_password">Forgot Password?</a>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.yash}
                >
                  Login
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
                  href="/register"
                >
                  Register Now
                </Button>
              </form>
            </div>
            {!maxWidth && (
              <div className={styles.img}>
                <Image
                  src="/assets/login/hero.svg"
                  alt="Login Illustration"
                  layout="fill"
                />
              </div>
            )}
          </div>
          <div className={styles.wave}></div>
          <Loading open={isLoading} txt="Logging you in..." />
          <Snackbar open={Boolean(error)} handleClose={() => setError(null)}>
            {error}
          </Snackbar>
          <Snackbar
            open={Boolean(success)}
            handleClose={() => setSuccess(null)}
          >
            {success}
          </Snackbar>
        </>
      )}
    </>
  );
}
