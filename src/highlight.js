const python = require('@lezer/python');
const common = require('@lezer/common');
const parser = python.parser;

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

function highlightSyntax(program, renderDiv, lineHeight) {
  function createLine() {
    let lDiv = document.createElement("div");
    lDiv.style = `position:relative; height:${lineHeight}px;`; 
    renderDiv.appendChild(lDiv);
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

  renderDiv.innerHTML = ''; 
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

module.exports = {highlightSyntax};
