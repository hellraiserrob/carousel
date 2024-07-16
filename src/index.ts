import "./main.scss";

import Carousel from "./carousel"
// import { cardTemplate } from "./templates";
// import { Breakpoint } from "./interfaces";

const carousels = document.querySelectorAll<HTMLElement>(`.carousel`);

// const options:Breakpoint[] = [
//   {
//     threshold: 0,
//     columns: 1,
//     gutter: 32,
//   },
//   {
//     threshold: 600,
//     columns: 3,
//     gutter: 32,
//   },
//   {
//     threshold: 1000,
//     columns: 4,
//     gutter: 32,
//   }
// ];

const grid = [{
  width: 0,
  items: 1
}, {
  width: 700,
  items: 2
}, {
  width: 900,
  items: 3
}
];

carousels.forEach(el => {
  const c = new Carousel({
    el,
    grid
  })

  c.setup();
})