/**
 * carousel class
 * wrap different ui elements in generic carousel functioanlity
 */

import debounce from "lodash/debounce";
import { getViewportWidth, getElementWidth } from "./utils";
import { Grid } from "./interfaces";

const css = {
  active: `carousel--active`,
  previous: `carousel__nav--previous`,
  next: `carousel__nav--next`,
  runner: `carousel__runner`,
  slide: `carousel__slide`,
  slideActive: `carousel__slide--active`,
  pager: `carousel__pager`,
  pagerNav: `carousel__pager__nav`,
  pagerNavActive: `carousel__pager__nav--active`,
  single: `carousel--single-page`,
};

export default class Carousel {
  el: HTMLElement;
  grid: Grid[];
  prefix: string;
  els: any;
  offset: number;
  clientX: number;
  clientY: number;
  threshold: number;
  windowWidth: number;
  totalWidth: number;
  totalSlides: number;
  perPage: number;
  totalPages: number;
  slideWidth: number;
  current: number;
  scroll: boolean;
  swipe: boolean;

  constructor(ops) {
    this.el = ops.el;
    this.grid = ops.grid;

    this.els = {
      previous: this.el.querySelector(`.${css.previous}`),
      next: this.el.querySelector(`.${css.next}`),
      runner: this.el.querySelector(`.${css.runner}`),
      slides: this.el.querySelectorAll(`.${css.slide}`),
      pager: this.el.querySelector(`.${css.pager}`)
    };

    this.offset = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.swipe = false;
    this.scroll = false;
    this.threshold = 75;

    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handeTouchStart = this.handeTouchStart.bind(this);
    this.handeTouchMove = this.handeTouchMove.bind(this);
    this.handeTouchEnd = this.handeTouchEnd.bind(this);
    this.handeTouchCancel = this.handeTouchCancel.bind(this);
    this.handlePagerClick = this.handlePagerClick.bind(this);
    this.resizeHandler = debounce(this.resizeHandler.bind(this), 100);
  }

  resizeHandler() {
    if (getViewportWidth() !== this.windowWidth) {
      this.setup();
    }
  }

  setup() {
    this.reset();

    this.windowWidth = getViewportWidth();
    this.totalWidth = getElementWidth(this.el);
    this.totalSlides = this.els.slides.length;
    this.perPage = 0;

    console.log(window.innerWidth);

    this.grid.forEach(breakpoint => {
      if (this.windowWidth >= breakpoint.width) {
        this.perPage = breakpoint.items;
      }
    });

    this.totalPages = Math.ceil(this.totalSlides / this.perPage);
    this.slideWidth = this.totalWidth / this.perPage;

    if (this.totalPages === 1) {
      this.el.classList.add(css.single);
    }
    else {
      this.el.classList.remove(css.single);
    }

    this.els.slides.forEach(el => {
      el.style.width = `${this.slideWidth}px`;
    });

    this.bind();
    this.checkArrows();
    this.show();
    this.updateTabIndex();
    this.renderPager();
  }

  reset() {
    this.el.classList.remove(css.active);
    this.els.runner.removeAttribute('style');

    this.offset = 0;
    this.current = 1;
  }

  bind() {
    this.unbind();

    this.els.next.addEventListener('click', this.handleNext);
    this.els.previous.addEventListener('click', this.handlePrevious);
    this.els.runner.addEventListener('touchstart', this.handeTouchStart);
    this.els.runner.addEventListener('touchmove', this.handeTouchMove);
    this.els.runner.addEventListener('touchend', this.handeTouchEnd);
    this.els.runner.addEventListener('touchcancel', this.handeTouchCancel);

    window.addEventListener('resize', this.resizeHandler);
  }

  unbind() {
    this.els.next.removeEventListener('click', this.handleNext);
    this.els.previous.removeEventListener('click', this.handlePrevious);
    this.els.runner.removeEventListener('touchstart', this.handeTouchStart);
    this.els.runner.removeEventListener('touchmove', this.handeTouchMove);
    this.els.runner.removeEventListener('touchend', this.handeTouchEnd);
    this.els.runner.removeEventListener('touchcancel', this.handeTouchCancel);

    window.removeEventListener('resize', this.resizeHandler);
  }

  handeTouchStart(e) {
    this.clientX = e.touches[0].clientX;
    this.clientY = e.touches[0].clientY;
  }

  handeTouchMove(e) {
    const deltaX = e.changedTouches[0].clientX - this.clientX;
    const deltaY = e.changedTouches[0].clientY - this.clientY;

    if (!this.swipe && !this.scroll) {
      if (Math.abs(deltaY) > 10) {
        // It's a scroll
        this.scroll = true;
      } else if (Math.abs(deltaX) > 7) {
        // It's a swipe
        this.swipe = true;
      }
    }

    if (this.swipe) {
      e.preventDefault();
      const tempOffset = this.offset + deltaX;

      this.els.runner.setAttribute(
        'style',
        this.getOffsetStyles('none', tempOffset)
      );
    }
  }

  handeTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - this.clientX;
    const difference = Math.abs(deltaX);

    if (difference > this.threshold) {
      if (deltaX > 0) {
        if (this.current !== 1) {
          this.previous();
        } else {
          this.resetOffset();
        }
      } else {
        if (this.current !== this.totalPages) {
          this.next();
        } else {
          this.resetOffset();
        }
      }
    } else {
      this.resetOffset();
    }

    this.swipe = false;
    this.scroll = false;
  }

  handeTouchCancel() {
    this.resetOffset();
  }

  handleNext(e) {
    e.preventDefault();
    this.next();
  }

  handlePrevious(e) {
    e.preventDefault();
    this.previous();
  }

  previous() {
    this.current -= 1;
    this.move();
  }

  next() {
    this.current += 1;
    this.move();
  }

  move() {
    let offset = 0;

    // are we on the last page
    if (this.current === this.totalPages) {
      const difference = this.totalSlides - this.perPage * this.totalPages;
      offset = this.slideWidth * difference;
    }

    const destination = ((this.current - 1) * this.totalWidth * -1) - offset;

    this.updateTabIndex();

    this.animate(destination, 700, () => {});

    this.updatePager();
    this.checkArrows();
  }

  checkArrows() {
    this.checkPreviousArrow();
    this.checkNextArrow();
  }

  checkPreviousArrow() {
    const disabled = this.current <= 1 ? true : false;
    this.els.previous.disabled = disabled;
  }

  checkNextArrow() {
    const disabled = this.current >= this.totalPages ? true : false;
    this.els.next.disabled = disabled;
  }

  resetOffset() {
    this.animate(this.offset, 200, () => { });
  }

  getOffsetStyles(transition, destination) {
    return `
      transition: ${transition};
      transform: translateX(${destination}px) translateZ(0);
    `;
  }

  animate(destination, duration = 500, cb, ease = "ease") {
    const durationSeconds = duration / 1000;
    const transition = `all ${ease} ${durationSeconds}s`;
    const styles = this.getOffsetStyles(transition, destination);

    this.els.runner.setAttribute("style", styles);

    window.setTimeout(cb, duration);
    this.offset = destination;
  }

  updateTabIndex() {
    this.els.slides.forEach(slide => {
      slide.querySelectorAll("button, a").forEach(el => {
        el.setAttribute('tabIndex', -1);
      });
    });

    const endIndex = this.current * this.perPage;
    let startIndex = endIndex - this.perPage;

    if (this.current === this.totalPages) {
      startIndex = this.totalSlides - this.perPage;
    }

    this.els.slides.forEach((slide, i) => {
      slide.classList.remove(css.slideActive);
      if (i >= startIndex && i < endIndex) {
        slide.classList.add(css.slideActive);
        slide.querySelectorAll('button, a').forEach(el => {
          el.removeAttribute('tabIndex');
        });
      }
    });
  }

  renderPager() {
    let pager = '';

    for (let i = 0; i < this.totalPages; i += 1) {
      const classes =
        i + 1 === this.current ? css.pagerNavActive : '';
      pager += `
        <button class="${css.pagerNav} ${classes}" data-id="${i +
        1}">${i + 1}</button>
      `;
    }

    this.els.pager.innerHTML = pager;
    this.els.pagerNav = this.el.querySelectorAll(`.${css.pagerNav}`);
    this.bindPagerClick();
  }

  bindPagerClick() {
    this.els.pagerNav.forEach(el => {
      el.addEventListener('click', this.handlePagerClick);
    });
  }

  handlePagerClick(e) {
    this.goTo(e.currentTarget.getAttribute('data-id'));
  }

  updatePager() {
    if (this.els.pagerNav) {
      this.els.pagerNav.forEach(el => {
        el.classList.remove(css.pagerNavActive);
        el.removeAttribute("disabled");
      });
      const active = this.els.pager.querySelector(`.${css.pagerNav}:nth-child(${this.current})`);
      active.classList.add(css.pagerNavActive);
      active.setAttribute("disabled", true)
    }
  }

  updateCount() {
    if (this.els.count) {
      this.els.count.innerHTML = `${this.current}/${this.totalPages}`;
    }
  }

  goTo(id) {
    this.current = parseInt(id, 10);
    this.move();
  }

  updateProgress() {
    const percent = this.current / this.totalPages * 100;
    this.els.progressBar.style.width = `${percent}%`;
  }

  show() {
    this.el.classList.add(css.active);
  }

  hide() {
    this.el.classList.remove(css.active);
  }
}
