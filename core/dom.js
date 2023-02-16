export class DOM {

  static stylesheet(path, id) {
    let e;
    if (!document.getElementById(id)) {
      e = document.createElement('link');
      e.id = id;
      e.rel = 'stylesheet';
      e.href = path;
      DOM.head.appendChild(e);
    } else {
      e = document.querySelector('#battle-styles');
    }
    return e;
  }

  static get head() {
    return document.querySelector('head');
  }

  static get body() {
    return document.querySelector('body');
  }

  static nav(parent, classes) {
    let e = document.createElement('nav');

    if (parent) {
      parent.appendChild(e);
    }

    DOM.classes(e, classes);


    return e;
  }

  static button(text, parent, classes, action) {
    let e = document.createElement('button');

    if (text) {
      DOM.text(text, e);
    }

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    if (action) {
      e.addEventListener('click', () => {
        action(e);
      });
    }

    return e;
  }

  static span(text, parent, classes) {
    let e = document.createElement('span');

    if (text) {
      DOM.text(text, e);
    }

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static a(text, parent, classes) {
    let e = document.createElement('a');

    if (text) {
      DOM.text(text, e);
    }

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static p(text, parent, classes) {
    let e = document.createElement('p');

    if (text) {
      DOM.text(text, e);
    }

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static ul(parent, classes) {
    let e = document.createElement('ul');

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static li(text, parent, classes) {
    let e = document.createElement('li');

    if (text) {
      DOM.text(text, e);
    }

    DOM.classes(e, classes);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static div(parent, classes) {
    let e = document.createElement('div');

    if (parent) {
      parent.appendChild(e);
    }

    DOM.classes(e, classes);

    return e;
  }

  static text(text, parent) {
    let e = document.createTextNode(text);

    if (parent) {
      parent.appendChild(e);
    }

    return e;
  }

  static classes(e, classes) {

    if (classes) {
      if (Array.isArray(classes)) {
        classes.forEach((c) => {
          e.classList.add(c);
        })
      } else {
        e.classList.add(classes);
      }
    }

  }
}
