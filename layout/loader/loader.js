export class Loader {

  static #loaderBg;
  static #loaderText;
  static #styles;
  static #open = false;

  static #build() {
    let vm = Loader;
    let bg = vm.#loaderBg;
    let text = vm.#loaderText;

    if (!vm.#styles) {
      vm.#styles = document.createElement('link');
      vm.#styles.id = 'loader-styles';
      vm.#styles.rel = 'stylesheet';
      vm.#styles.href = './layout/loader/loader.css';
      document.querySelector('head').appendChild(vm.#styles);
    }

    if (!bg) {
      bg = document.createElement('div');
      bg.classList.add('loader');
      bg.classList.add('loader-hide');

      let inner = document.createElement('div');
      inner.classList.add('inner-loader');
      bg.appendChild(inner);
      
      vm.#loaderBg = bg;
      
      document.querySelector('body').appendChild(bg);
    }

    if (!text) {
      text = document.createElement('div');
      text.classList.add('loader-over');
      text.classList.add('loader-hide');

      let inner = document.createElement('div');
      inner.classList.add('loader-msg');
      inner.innerHTML = 'LOADING';
      text.appendChild(inner);
      
      vm.#loaderText = text;

      document.querySelector('body').appendChild(text);
    }
  }

  static open() {
    let vm = Loader;

    vm.#build();

    if (vm.#open) {
      return;
    }

    vm.#open = true;

    vm.#loaderText.classList.remove('loader-hide');
    vm.#loaderBg.classList.remove('loader-hide');
  }

  static close(delay = 0) {
    let vm = Loader;

    if (!vm.#open) {
      return;
    }

    setTimeout(() => {
      vm.#loaderBg.classList.add('loader-hide');
      vm.#loaderText.classList.add('loader-hide');
      vm.#open = false;
    }, delay);

  }

}
