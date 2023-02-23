import { DOM } from '../../core/dom.js';
import { EventHandler } from '../../core/eventHandler.js';


export class Alert extends EventHandler {
  
  static popup(msg, delay = 2000) {
    DOM.stylesheet('./ui/alert/alert.css', 'alert_styles');
    
    let box = DOM.div(undefined, ['alert-box']);
    DOM.text(msg, box);
    DOM.append(box);
    setTimeout(()=>{
      DOM.remove(box);
    }, delay);
  }
  
}
