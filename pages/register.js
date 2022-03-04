import Head from "next/head";
import Image from "next/image";
import { appName } from "../globals";
import styles from "../styles/Register.module.css";
import {
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from "@material-ui/core";
import Loading from "../components/loading";
import { useState, useEffect } from "react";
import useHit from "../components/useHit";
import Snackbar from "../components/snackbar";
import useAuth from "../components/useAuth";

export default function Login() {
  const maxWidth = useMediaQuery("(max-width: 832px)");
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = useHit();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCPass] = useState("");
  const auth = useAuth();
  const [visible,setVisible] = useState(false);

  useEffect(()=>{
    if(auth.isLoggedIn()){
      window.location.href= "/";
    }
    else{
      setVisible(true);
    }
  },[auth])

  function register(e) {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    sendRequest("register", {
      name,
      email,
      phone,
      password,
      cpassword: cpass,
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
        <title>Register - {appName}</title>
      </Head>
      {visible && (
        <>
          <div className={styles.main}>
            {!maxWidth && (
              <div className={styles.img}>
                <Image
                  src="/assets/register/hero.svg"
                  alt="Login Illustration"
                  layout="fill"
                />
              </div>
            )}
            <div className={styles.container}>
              <Typography variant="h4" className={styles.heading}>
                Register
              </Typography>
              <form onSubmit={register}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Name"
                  required
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Phone Number"
                  required
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
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
                <TextField
                  type="password"
                  variant="outlined"
                  color="primary"
                  label="Password"
                  required
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  type="password"
                  variant="outlined"
                  color="primary"
                  label="Confirm Password"
                  required
                  className={styles.input}
                  value={cpass}
                  onChange={(e) => setCPass(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.yash}
                >
                  Register
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
          </div>
          <div className={styles.wave}></div>
          <Loading open={isLoading} txt="Registering User..." />
          <Snackbar open={Boolean(success)}>{success}</Snackbar>
          <Snackbar open={Boolean(error)}>{error}</Snackbar>
        </>
      )}
    </>
  );
}
