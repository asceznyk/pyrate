const code = document.querySelector("#code");
const capture = document.querySelector("#capture");
const cursor = document.querySelector("#cursor");

function updateCode() {
  const hscl = 7.83;
  const vscl = 16;

  function highlightSyntax() {
    code.innerHTML = '';
    let value = capture.value;
    let lines = value.split('\n');

    for (let i = 0; i < lines.length; i++) {
      let lineDiv = document.createElement("div");
      lineDiv.style = `position:relative; height:${vscl}px;`;
      code.appendChild(lineDiv);

      let texts = lines[i].split(' ')
      let currentTag = "";
      for(let j = 0; j < texts.length; j++) {
        currentTag += `<span>${texts[j]}</span>`;
        if(j != texts.length-1) {
          currentTag += `&nbsp;`;
        }
      }
      lineDiv.innerHTML = currentTag; 
    }
  }

  function followCursor() {
    let value = capture.value.slice(0, capture.selectionStart); 
    let matches = [...value.matchAll(/\n/g)];
    let cy = matches.length;

    let cx = 0;
    if(matches.length > 0) {
      let midx = matches[matches.length-1].index;
      cx = value.slice(midx, value.length).replace('\n', '').length; 
    } else {
      cx = value.length;
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
      if(!arrow(keycode)) highlightSyntax(); 
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
      if(!arrow(keycode)) highlightSyntax();
      followCursor();
    }
  })
}

updateCode();



