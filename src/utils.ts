/**
 * common utilities
 */

export function getViewportHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight;
}

export function getViewportWidth(): number {
  return window.innerWidth || document.documentElement.clientWidth;
}

export const getElementWidth = (el:HTMLElement):number => {
  return el.offsetWidth;
};
