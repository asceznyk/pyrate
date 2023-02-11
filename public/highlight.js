const python = require('@lezer/python');
const common = require('@lezer/common');
const parser = python.parser;

const code = document.querySelector("#code");
const capture = document.querySelector("#capture");
const cursor = document.querySelector("#cursor");

const hscl = 7.83;
const vscl = 16;

function isAlphaNumeric(str) {
  let code, i, len;
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
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
    cursor.style.left = parseInt(cx*hscl) + "px";
  }

  function arrow(keycode) {
    return (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) 
  }

  function validateKey(keycode) {
    let valid = 
          (keycode > 47 && keycode < 58) || // number keys
          (keycode == 32 || keycode == 13 || keycode == 8 || keycode == 9) ||
          arrow(keycode) ||
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223);   // [\]' (in order)
    return valid;
  }

  cursor.style.left = "0px";
  code.addEventListener("click", () => {
    capture.focus();
  })

  capture.addEventListener("keyup", (e) => {
    let keycode = e.keyCode;
    if(validateKey(keycode)) {
      if(!arrow(keycode)) highlightSyntax(capture.value); 
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






