class DOM {
  
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
  
  static nav() { 
    let e =  document.createElement('nav');
    return e;
  }
  
  static button(text, parent) { 
    let e =  document.createElement('button');
    
    if(text) {
      DOM.text(text, e);
    }
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static span(text, parent) { 
    let e =  document.createElement('span');
    
    if(text) {
      DOM.text(text, e);
    }
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static a(text, parent) { 
    let e =  document.createElement('a');
    
    if(text) {
      DOM.text(text, e);
    }
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static p(text, parent) { 
    let e =  document.createElement('p');
    
    if(text) {
      DOM.text(text, e);
    }
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static ul(parent) { 
    let e =  document.createElement('ul');
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static li(text, parent) { 
    let e =  document.createElement('li');
    
    if(text) {
      DOM.text(text, e);
    }
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static div(parent) { 
    let e =  document.createElement('div');
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  
  static text(text, parent) {
    let e = document.createTextNode(text);
    
    if(parent) {
      parent.appendChild(e);
    }
    
    return e;
  }
  

}
