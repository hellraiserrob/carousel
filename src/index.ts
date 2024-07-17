import "./main.scss";

import Carousel from "./carousel"
import { Options } from "./interfaces";

const carousels = document.querySelectorAll<HTMLElement>(`.carousel`);


carousels.forEach(el => {
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