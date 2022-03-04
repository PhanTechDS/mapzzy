import Head from "next/head";
import Image from "next/image";
import { appName } from "../globals";
import {
  Typography,
  Button,
  useMediaQuery,
  Icon,
  TextField,
} from "@material-ui/core";
import styles from "../styles/Home.module.css";
import useAuth from "../components/useAuth";
import { useState, useEffect } from "react";
import useHit from "../components/useHit";
import mapzzy from "../components/mapzzy";
import Modal from "../components/modal";
import Loading from "../components/loading";
import Slider from "../components/slider";
import Select from "../components/select";

let verified = false;
let lat_long = null;
let map;

function Question({ id, question, options, value, onChange }) {
  return (
    <div className={styles.question}>
      <Select
        label={question}
        id={id}
        items={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function Home() {
  const maxWidth = useMediaQuery("(max-width: 522px)");
  const hideBlob = useMediaQuery("(max-width: 1083px)");
  const changeLayout = useMediaQuery("(max-width: 961px)");
  const [location, setLocation] = useState("");
  const auth = useAuth();
  const [logged, setLogged] = useState(null);
  const sendRequest = useHit();
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState([0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const questions = [
    "Are you a gym freak?",
    "Do you like cooking?",
    "Do you like playing sports?",
    "Do you like eating outside",
    "Are you?",
  ];
  const options = [
    ["No", "Yes"],
    ["Yes", "No"],
    ["Yes", "No"],
    ["No", "Yes", "Sometimes"],
    ["Male", "Female"],
  ];
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn()) {
      if (!verified) {
        auth.verifyLogin(
          sendRequest,
          () => {
            setLogged(false);
          },
          (data) => {
            setLogged(true);
          }
        );
        verified = true;
      }
    } else {
      setLogged(false);
    }
  }, [auth, sendRequest]);

  useEffect(() => {
    if (auth.isLoggedIn() && showResults) {
      setLoading(true);
      mapzzy.loadScripts(() => {
        map = L.map(
          document.querySelector("." + styles.results + " ." + styles.map),
          {
            center: lat_long.split(","),
            zoom: 10,
          }
        );
        var OpenStreetMap_Mapnik = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        );
        OpenStreetMap_Mapnik.addTo(map);
      });
      mapzzy
        .getResult(lat_long)
        .then((c) => {
          let markers = [];
          c.forEach((e, i) => {
            let r = [chance.random() * 0.05, chance.random() * 0.05];
            markers.push(
              L.marker([
                e.geocodes.main.latitude + r[0],
                e.geocodes.main.longitude + r[1],
              ])
            );
            markers[i].addTo(map);
            let price = chance.random() * 10000;

            if (price < 4000) {
              price = 4000;
            }
            markers[i].bindPopup(
              chance.name().split(" ")[0] + "'s Rent<br>₹" + Math.round(price)
            );
            setLoading(false);
          });
        })
        .catch((err) => {
          console.log(err);
          alert("Unable to get results!");
          setShowResults(false);
          setLoading(false);
        });
      // setLoading(false);
    }
  }, [showResults]);

  function changeLocation(e) {
    setLocation(e.target.value);
  }

  function submit(e) {
    if (e.which === 13 || e.keyCode === 13 || e.key === "Enter") {
      if (location.replace(" ", "") !== "") {
        setDisabled(true);
        mapzzy
          .geodecode(location)
          .then((c) => {
            setDisabled(false);
            if (!c) {
              alert("Please enter a valid location!");
              return;
            }
            if (c.country_code === "in") {
              setLocation(c.address_line1);
              lat_long = c.lat + "," + c.lon;
              setShowModal(true);
            } else {
              alert("Please enter a location in India");
            }
          })
          .catch(() => {
            setDisabled(false);
            alert("Please enter a valid location!");
          });
      }
    }
  }

  function getCurrLoc() {
    mapzzy.getCurrLoc((ll) => {
      if (ll !== -1) {
        lat_long = ll;
        setShowModal(true);
      }
    });
  }

  return (
    <>
      <Head>
        <title>Home - {appName}</title>
      </Head>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.logo}></div>
          <Typography variant="h4">{appName}</Typography>
        </div>
        {logged === false && (
          <div className={styles.buttons}>
            {!maxWidth && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  href="/login"
                  className={styles.login}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href="/register"
                  className={styles.register}
                >
                  Sign Up
                </Button>
              </>
            )}
            {maxWidth && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  href="/login"
                  className={styles.login}
                >
                  <Icon>login</Icon>
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  href="/register"
                  className={styles.register}
                >
                  <Icon>app_registration</Icon>
                </Button>
              </>
            )}
          </div>
        )}

        <div className={styles.wave}></div>
      </div>
      <div className={styles.section}>
        {changeLayout && (
          <div className={styles.hero}>
            <Image src="/assets/hero.svg" alt="Hero" layout="fill" />
          </div>
        )}
        <div className={styles.content}>
          <Typography variant="h3" className={styles.title}>
            Find your best stay
          </Typography>
          <Typography variant="h6">
            Ghar se <em>duuuur...</em> Ghar wali <em>feeling</em>
          </Typography>
          <Typography variant="h6">
            We at MAPZZY are fully committed towards our goal to help our
            customers find the most ideal place to stay when they shift to some
            new city. So are you going somewhere to pursue your dream or are you
            going for a vacation? Come to us and we will be more than happy to
            help you out !<br />
            {logged === false && (
              <b>Press the button below to start your journey with us...</b>
            )}
          </Typography>
          {logged === false && (
            <Button
              className={styles.registerBtn}
              variant="contained"
              color="primary"
              href="/register"
            >
              Get Started
            </Button>
          )}
          {logged === true && (
            <div className={styles.location}>
              <TextField
                placeholder="Enter a location..."
                variant="outlined"
                className={styles.input}
                value={location}
                onChange={changeLocation}
                onKeyUp={submit}
                disabled={disabled}
              />
              <div className={styles.or}>
                <span></span>
                <p>or</p>
              </div>
              <Button
                variant="contained"
                color="primary"
                className={styles.currLoc}
                onClick={getCurrLoc}
              >
                Use your current location
              </Button>
            </div>
          )}
        </div>
        {!changeLayout && (
          <div className={styles.hero}>
            <Image src="/assets/hero.svg" alt="Hero" layout="fill" />
          </div>
        )}
      </div>
      {!hideBlob && <div className={styles.blob}></div>}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Slider
          items={questions.map((e, i) => {
            return (
              <Question
                question={e}
                options={options[i]}
                key={i}
                id={e.toLowerCase().replace(/\s/g, "_") + "_id"}
                value={answers[i]}
                onChange={(e) =>
                  setAnswers((oldAnswers) => {
                    let newAnswers = oldAnswers;
                    newAnswers[i] = e.target.value;
                    return [...newAnswers];
                  })
                }
              />
            );
          })}
          onSubmit={() => setShowResults(true)}
        />
      </Modal>
      <Loading open={loading} />
      <Modal
        open={showResults}
        className={styles.results}
        onClose={() => setShowResults(false)}
      >
        <div className={styles.map}></div>
      </Modal>
    </>
  );
}
