import { parser } from '@lezer/python';
import { TreeCursor } from '@lezer/common';


export function highlightSyntax (
  program:string, 
  renderDiv:HTMLElement, 
  lineHeight:number
) {

  function isAlphaNumeric(str:string): boolean {
    let ascii, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      ascii = str.charCodeAt(i);
      if (
        !(ascii > 47 && ascii < 58) && // numeric (0-9)
        !(ascii > 64 && ascii < 91) && // upper alpha (A-Z)
        !(ascii > 96 && ascii < 123) // lower alpha (a-z)
      ) return false;
    }
    return true;
  };

  function createLine(): HTMLElement {
    let lDiv = document.createElement("div");
    lDiv.setAttribute('style', `position:relative; height:${lineHeight}px;`); 
    renderDiv.appendChild(lDiv);
    return lDiv;
  }

  function fillWhiteSpace(from:number, to:number) {
    for(let i = from; i < to; i++) { 
      if(program[i] == '\n') lineDiv = createLine();
      else if (program[i] == ' ')  lineDiv.innerHTML += '&nbsp';
    }
  }

  function getKWType(node:any, clsname:string, value:string): string {
    cls = clsname.toLowerCase();
    if(cls == value) cls = isAlphaNumeric(value) ?  "keyword" : "seperator";
    else if(cls.endsWith("op")) cls = "operator";
    else if( 
      node._parent != null &&
      node._parent.type.clsname == 'FunctionDefinition' && 
      clsname == 'VariableName'
    ) cls = "def";
    return cls;
  }

  function fillNodeColor() { 
    let [from, to] = [treeCursor.from, treeCursor.to];
    let kw = getKWType(treeCursor.node, treeCursor.name, program.slice(from, to)) ;
    let kwSpan = document.createElement("span");
    kwSpan.classList.add(`py-${kw}`);
    for(let i = from; i < to; i++) {
      if(program[i] == '\n') {
        lineDiv.appendChild(kwSpan);
        kwSpan = document.createElement("span");
        kwSpan.classList.add(`py-${kw}`);
        lineDiv = createLine();
        continue;
      } 
      kwSpan.innerHTML += program[i];
    }
    lineDiv.appendChild(kwSpan); 
  }

  renderDiv.innerHTML = ''; 
  let treeCursor:TreeCursor = parser.parse(program).cursor();
  let lineDiv:HTMLElement;
  let prevPoint:number = 0;
  let cls:string;
  lineDiv = createLine();
  while(treeCursor.next()) {
    if(treeCursor.node.firstChild != null) continue;
    fillWhiteSpace(prevPoint, treeCursor.from);
    fillNodeColor();
    prevPoint = treeCursor.to;
  }

}
