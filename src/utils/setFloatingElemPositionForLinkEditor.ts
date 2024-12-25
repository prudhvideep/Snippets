const VERTICAL_GAP = 50;
const HORIZONTAL_OFFSET = 0;

export function setFloatingElemPositionForLinkEditor(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0';
    floatingElem.style.transform = 'translate(-10000px, -10000px)';
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - floatingElemRect.height - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top = targetRect.bottom + verticalGap;
  }

  if (left + floatingElemRect.width > window.innerWidth) {
    left = window.innerWidth - floatingElemRect.width - horizontalOffset;
  }

  if (left < 0) {
    left = horizontalOffset;
  }

  floatingElem.style.position = "fixed";
  floatingElem.style.top = `${top}px`;
  floatingElem.style.left = `${left}px`;
  floatingElem.style.opacity = "1";
  floatingElem.style.transform = "none"; 
}
