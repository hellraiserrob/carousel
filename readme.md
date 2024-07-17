[![Carousel banner](./.github/assets/banner.svg)](https://hellraiserrob.github.io/carousel)

# Carousel

An example of a flexible carousel library for you to take and use as you wish in your projects.  It's simple to use the lbirary to wrap your own UI elements in standard carousel functionality.  See the demo page for some simple examples.

[Demo](https://hellraiserrob.github.io/carousel/)

## Features

- Vanilla Typescript
- Light & Responsive
- Touch events
- Use in your projects or as learning material

## Options


## Setup

Pass options to configure your carousel for different breakpoints

### Options

|             | Description | Type    | 
| ----------- | ----------- | ------- | 
| el    | The pixel >= this should apply to  | HTMLElement |
| grid    | See Grid type below  | Grid[] |
| showPager?    | Optional flag to hide the carousel pager  | Boolean |

### Grid

|             | Description | Type    | 
| ----------- | ----------- | ------- | 
| width    | If the viewport width is higher than this number the below items total will be used  | number |
| items    | The number of carousel slides to show at one time   | number |

### Usage

e.g.

```javascript
import Carousel from "./carousel"

const carousels = document.querySelectorAll<HTMLElement>(`.carousel`);

tiles.forEach(el => {
  const options: Options = {
    el,
    grid: [{
      width: 0, // from 0px - 699px there will only be 1 slide visible
      items: 1
    }, {
      width: 700, // from 700px - 899px there will only be 2 slides visible
      items: 2
    }, {
      width: 900, // from > 900px there will 8 slides visible
      items: 8
    }
    ]
  };
  const c = new Carousel(options)

  c.setup();
})
```
