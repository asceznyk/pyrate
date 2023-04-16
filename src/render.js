const highlight = require('./highlight.js');
const highlightSyntax = highlight.highlightSyntax;

const hscl = 7.83;
const vscl = 16;

const code = document.querySelector("#code");
const lines = document.querySelector("#lines");
const capture = document.querySelector("#capture");
const cursor = document.querySelector("#cursor");

function render() {
  function followCursor() {
    let value = capture.value.slice(0, capture.selectionStart); 
    let matches = [...value.matchAll(/\n/g)];
    let cy = matches.length;

    let cx = value.length;
    if(cy > 0) { 
      cx = value.slice(matches[cy-1].index, value.length).replace('\n', '').length; 
    }

    cursor.style.top = parseInt(cy*vscl) + "px";
    cursor.style.left = parseInt((cx+lineOffset+1) * hscl)  + "px";
  }

  function isArrow(keycode) {
    return (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) 
  }

  function validateKey(keycode) {
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

  function setLineNums(program) {
    let numLines = program.split('\n').length;
    lineOffset = numLines.toString().length + 1;

    lines.innerHTML = '';
    for(let i = 0; i < numLines; i++) {
      let offLine = '';
      for(let k = 0; k < lineOffset - (i+1).toString().length; k++) offLine += '&nbsp;';
      lines.innerHTML += `<div class='line-num' style='height:${vscl}px;'>${offLine}${i+1}&nbsp;</div>`;
    }

    let wOff = parseInt((lineOffset+1) * hscl);
    lines.style = `width:${wOff}px`;
    code.style = `width:calc(100% - ${wOff}px); height:${lines.offsetHeight}px;`;
  }
  
  let lineOffset;
  let initOff = (3*hscl);

  lines.innerHTML = `<div class='line-num' style='height:${vscl}px'>&nbsp;1&nbsp;</div>`;
  lines.style = `width:${initOff}px`;
  code.style.width = `calc(100% - ${initOff}px)`;

  cursor.style.left = initOff + "px";
  code.addEventListener("click", () => {
    capture.focus();
  })

  capture.addEventListener("keyup", (e) => {
    let keycode = e.keyCode;
    if(validateKey(keycode)) {
      if(!isArrow(keycode)) {
        let val = capture.value;
        setLineNums(val);
        highlightSyntax(val, code, vscl);
      } 
    }
    followCursor();
  })

  capture.addEventListener("keydown", (e) => {
    let keycode = e.keyCode;
    if(validateKey(keycode)) {
      if(keycode == 9) {
        e.preventDefault(); 
        let start = e.target.selectionStart;
        let tabStr = "    "; 
        let end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) +
          tabStr + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + tabStr.length;
      } 
      followCursor();
    }
  })
}

render();


