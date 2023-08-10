import { highlightSyntax } from './highlight';

const hscl:number = 7.83;
const vscl:number = 16;

const tabStr:string = "    "; 

const code = document.querySelector<HTMLElement>("#code")!;
const lines = document.querySelector<HTMLElement>("#lines")!;
const capture = document.querySelector<HTMLInputElement>("#capture")!;
const cursor = document.querySelector<HTMLElement>("#cursor")!;

(function () {
  function followCursor() {
    let value = capture.value.slice(0, capture.selectionStart as number); 
    let matches = [...value.matchAll(/\n/g)];
    let cy = matches.length;

    let cx = value.length;
    if(cy > 0) { 
      cx = value.slice(matches[cy-1].index, value.length).replace('\n', '').length; 
    }

    cursor.setAttribute('style', `top:${cy*vscl}px; left:${(cx+lineOffset+1)*hscl}px`);
  }

  function isArrow(keycode:number): boolean {
    return (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) 
  }

  function validateKey(keycode:number): boolean {
    let valid = 
      (keycode > 47 && keycode < 58) || // number keys
      (keycode == 32 || keycode == 13 || keycode == 8 || keycode == 9) ||
      isArrow(keycode) ||
      (keycode > 64 && keycode < 91) || // letter keys
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223);   // [\]' (in order)
    return valid;
  }

  function setLineNums(program:string) {
    let numLines = program.split('\n').length;
    lineOffset = numLines.toString().length + 1;

    lines.innerHTML = '';
    for(let i = 0; i < numLines; i++) {
      let offLine = '';
      for(let k = 0; k < lineOffset - (i+1).toString().length; k++) offLine += '&nbsp;';
      lines.innerHTML += `<div class='line-num' style='height:${vscl}px;'>${offLine}${i+1}&nbsp;</div>`;
    }

    let wOff:number = (lineOffset+1)*hscl;
    lines.setAttribute('style', `width:${wOff}px`);
    code.setAttribute('style', `width:calc(100% - ${wOff}px); height:${lines.offsetHeight}px;`);
  }

  let lineOffset:number;
  let initOff:number = 3*hscl;

  lines.innerHTML = `<div class='line-num' style='height:${vscl}px'>&nbsp;1&nbsp;</div>`;
  lines.setAttribute('style', `width:${initOff}px`);
  code.setAttribute('style', `width:calc(100% - ${initOff}px)`);

  cursor.setAttribute('style',`left:${initOff}px`);
  code.addEventListener("click", () => {
    capture.focus();
  })

  capture.addEventListener("keyup", (e:KeyboardEvent) => {
    let keycode:number = e.keyCode;
    if(validateKey(keycode)) {
      if(!isArrow(keycode)) {
        let val = capture.value;
        setLineNums(val);
        highlightSyntax(val, code, vscl);
      } 
    }
    followCursor();
  })

  capture.addEventListener("keydown", (e:KeyboardEvent) => {
    let keycode:number = e.keyCode;
    if(validateKey(keycode)) {
      if(keycode == 9) {
        e.preventDefault();
        let tgt = e.target as HTMLInputElement;
        let start:number = tgt.selectionStart!;
        let end:number = tgt.selectionEnd!;
        tgt.value = tgt.value.substring(0, start) + tabStr + tgt.value.substring(end);
        tgt.selectionStart = tgt.selectionEnd = start + tabStr.length;
      } 
      followCursor();
    }
  })
})();


