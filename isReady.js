
const readyState = () => 
  document.readyState;

const doScroll = () => 
  document.documentElement.doScroll;

const isLoaded = () => 
  readyState() === 'complete';

const isLoading = () => 
  readyState() === 'loading';

const isReady = () => 
  isLoaded() || (!isLoading() && !doScroll());

export const go = (toRun) => {
  if (isReady()) {
    toRun();
  } else {
    document.addEventListener(
      "DOMContentLoaded", 
      toRun);
  }
};
