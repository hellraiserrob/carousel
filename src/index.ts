/**
 * entry point showing generic usage
 */

import "./main.scss";

import Carousel from "./carousel"
import { Options } from "./interfaces";

const tiles = document.querySelectorAll<HTMLElement>(`.carousel--tiles`);
const cards = document.querySelectorAll<HTMLElement>(`.carousel--cards`);
const features = document.querySelectorAll<HTMLElement>(`.carousel--features`);

features.forEach(el => {
  const options: Options = {
    el,
    grid: [{
      width: 0,
      items: 1
    }],
    showPager: false
  };
  const c = new Carousel(options)

  c.setup();
})

tiles.forEach(el => {
  const options: Options = {
    el,
    grid: [{
      width: 0,
      items: 1
    }, {
      width: 700,
      items: 2
    }, {
      width: 900,
      items: 8
    }
    ]
  };
  const c = new Carousel(options)

  c.setup();
})


cards.forEach(el => {
  const options: Options = {
    el,
    grid: [{
      width: 0,
      items: 1
    }, {
      width: 700,
      items: 2
    }, {
      width: 900,
      items: 3
    }
    ]
  };
  const c = new Carousel(options)

  c.setup();
})