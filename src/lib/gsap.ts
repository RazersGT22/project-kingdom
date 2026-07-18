import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Tech Bible Bab 4 — GSAP + ScrollTrigger plugin, registrasi sekali di satu tempat.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
