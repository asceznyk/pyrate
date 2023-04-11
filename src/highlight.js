const python = require('@lezer/python');
const common = require('@lezer/common');
const parser = python.parser;

const code = document.querySelector("#code");
const lines = document.querySelector("#lines");
const capture = document.querySelector("#capture");
const cursor = document.querySelector("#cursor");

const hscl = 7.83;
const vscl = 16;

function isAlphaNumeric(str) {
  let ascii, i, len;
  for (i = 0, len = str.length; i < len; i++) {
    ascii = str.charCodeAt(i);
    if (!(ascii > 47 && ascii < 58) && // numeric (0-9)
      !(ascii > 64 && ascii < 91) && // upper alpha (A-Z)
      !(ascii > 96 && ascii < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

function highlightSyntax(program) {
  function createLine() {
    let lDiv = document.createElement("div");
    lDiv.style = `position:relative; height:${vscl}px;`; 
    code.appendChild(lDiv);
    return lDiv;
  }

  function fillWhiteSpace(from, to) {
    for(let i = from; i < to; i++) { 
      if(program[i] == '\n') lineDiv = createLine();
      else if (program[i] == ' ')  lineDiv.innerHTML += '&nbsp';
    }
  }

  function getKWType(node, name, value) {
    cls = name.toLowerCase();

    if(cls == value) {
      if(isAlphaNumeric(value)) cls = "keyword";
      else cls = "seperator";
    }

    if(cls.endsWith("op")) cls = "operator";
    if( 
      node._parent != null &&
      node._parent.type.name == 'FunctionDefinition' && 
      name == 'VariableName'
    ) 
      cls = "def";

    return cls;
  }

  function fillNodeColor() { 
    let [from, to] = [treeCursor.from, treeCursor.to];
    let cls = getKWType(treeCursor.node, treeCursor.name, program.slice(from, to));

    let kwSpan = document.createElement("span");
    kwSpan.classList.add(`py-${cls}`);
    for(let i = from; i < to; i++) {
      if(program[i] == '\n') {
        lineDiv.appendChild(kwSpan);
        kwSpan = document.createElement("span");
        kwSpan.classList.add(`py-${cls}`);
        lineDiv = createLine();
        continue;
      } 
      kwSpan.innerHTML += program[i];
    }
    lineDiv.appendChild(kwSpan); 
  }

  code.innerHTML = ''; 
  let treeCursor = parser.parse(program).cursor();
  let lineDiv;
  let prevPoint = 0;
  let cls, value;

  lineDiv = createLine();
  while(treeCursor.next()) {
    if(treeCursor.node.firstChild != null) continue
    fillWhiteSpace(prevPoint, treeCursor.from);
    fillNodeColor();
    prevPoint = treeCursor.to;
  }
}

function updateCode() {
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
    code.style = `width:calc(100% - ${wOff}px)`;
  }
  
  let lineOffset;
  let initOff = (3*hscl);

  lines.innerHTML = `<div class='line-num' style='height:${vscl}px'>&nbsp;1&nbsp;</div>`;
  lines.style = `width:${initOff}px`;
  code.style = `width:calc(100% - ${initOff}px)`;

  cursor.style.left = initOff + "px";
  code.addEventListener("click", () => {
    capture.focus();
  })

  capture.addEventListener("keyup", (e) => {
    let keycode = e.keyCode;
    if(validateKey(keycode)) {
      if(!isArrow(keycode)) {
        setLineNums(capture.value);
        highlightSyntax(capture.value);
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

updateCode();






