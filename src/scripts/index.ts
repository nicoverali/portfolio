import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", (event) => {
  const aboutMeTween = gsap.from(".about-me *:not(.card)", {
    opacity: 0,
    y: 20,
    duration: 1,
    scrollTrigger: {
      trigger: ".about-me",
      start: "top top+=300px",
    },
  });

  const tl = gsap.timeline({
    delay: 1,
    scrollTrigger: {
      trigger: ".about-me",
      start: "top top+=80px",
      end: "+=200%",
      fastScrollEnd: true,
      preventOverlaps: true,
      pin: true,
      scrub: 1,
    },
  });

  const cardsFrom = {
    opacity: 0,
    y: 32,
    boxShadow: "0 4px 4px 0 var(--color-shadow)",
  };
  const cardsTo = function (i) {
    return {
      keyframes: [
        {
          opacity: 1,
          y: 0 - i * 16,
        },
        {
          boxShadow: `0 ${i * 2}px ${i * 2}px 0 var(--color-shadow)`,
        },
      ],
    };
  };

  tl.fromTo(".card:first-child", cardsFrom, {
    ...cardsTo(0),
    duration: 1,
    delay: 1,
  });
  tl.to(".background-text", { opacity: 0, duration: 1 }, ">-1");

  for (let i = 1; i <= 2; i++) {
    tl.fromTo(`.card:nth-child(${i + 1})`, cardsFrom, {
      ...cardsTo(i),
      duration: 1,
    });
  }
});
