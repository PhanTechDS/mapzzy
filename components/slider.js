import styles from "../styles/components/slider.module.css";
import { IconButton, Icon } from "@material-ui/core";
import { useState, useRef, useEffect } from "react";

function Slider({ className, items, onSubmit }) {
  const [curr, setCurr] = useState(0);
  const [disable, setDisable] = useState([true, false]);
  const [Next, setNext] = useState(null);
  const [Prev, setPrev] = useState(null);
  const [NextP, setNextP] = useState(null);
  const [PrevP, setPrevP] = useState(null);
  const [nextTxt, setNextTxt] = useState("arrow_forward_ios");

  useEffect(() => {
    const slider = document.querySelector(
      "." + styles.slider + " ." + styles.slides
    );
    const slides = document.querySelectorAll(
      "." + styles.slider + " ." + styles.slide
    );
    slider.style.height = slides[0].clientHeight + "px";
  }, [curr]);

  function next() {
    if (curr < items.length - 1) {
      setDisable([false, false]);
      setPrev(curr);
      setNext(curr + 1);
      setPrevP(null);
      setNextP(null);
      setCurr((c) => c + 1);
      setNextTxt("arrow_forward_ios");
      let k = setTimeout(() => {
        setPrev(null);
        setNext(null);
        clearTimeout(k);
      }, 500);
    }

    if (curr === items.length - 2) {
      setNextTxt("done");
    }

    if (curr === items.length - 1) {
      onSubmit && onSubmit();
    }
  }

  function prev() {
    setNextTxt("arrow_forward_ios");
    if (curr > 0) {
      setPrevP(curr);
      setNextP(curr - 1);
      setPrev(null);
      setNext(null);
      setDisable([false, false]);
      setCurr((c) => c - 1);
      let k = setTimeout(() => {
        setPrevP(null);
        setNextP(null);
        clearTimeout(k);
      }, 500);
    }

    if (curr === 1) {
      setDisable([true, false]);
    }
  }

  return (
    <div className={styles.slider + " " + className}>
      <div className={styles.slides}>
        {items.map((e, i) => {
          return (
            <div
              className={
                styles.slide +
                " " +
                (i === curr && styles.active) +
                " " +
                (Prev === i && styles.prevSlide) +
                " " +
                (Next === i && styles.nextSlide) +
                " " +
                (PrevP === i && styles.prevSlideP) +
                " " +
                (NextP === i && styles.nextSlideP)
              }
              key={i}
            >
              {e}
            </div>
          );
        })}
      </div>
      <div className={styles.options}>
        <IconButton
          className={styles.prev}
          disabled={disable[0]}
          onClick={prev}
        >
          <Icon>arrow_back_ios_new</Icon>
        </IconButton>
        <IconButton
          className={styles.next}
          disabled={disable[1]}
          onClick={next}
        >
          <Icon>{nextTxt}</Icon>
        </IconButton>
      </div>
    </div>
  );
}

export default Slider;
