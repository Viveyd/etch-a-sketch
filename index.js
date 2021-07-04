const gridCon = document.getElementById("grid-con");
const sizeBox = document.getElementsByTagName('input')[0];
const resizeBtn = document.getElementsByTagName('button')[0];
let lineToggle = document.getElementById('line-toggle')
let randomizer = document.getElementById('randomizer');
let colorPicker = document.getElementById("color-picker");
let eraser = document.getElementById('eraser');
let shadeToggle = document.getElementById("shade-toggle");
let defaultSize = 32;
let defaultHexColor = "#186276"
let selectedColor = defaultHexColor;

let lastSelectedColor;
let cellIsEmpty = false;
colorPicker.value = defaultHexColor;
setGridSize(defaultSize);
lineToggle.style.background = "salmon";
let toggledLines = true;
let eraserOn = false;
let randomizerOn = false;
sizeBox.value = gridCon.children.length;



// The following just adds function and style to eraser, shade, grid toggle, colorpicker and randomizer. Some toggles can't be used with other toggles and will disable if forced.
// START
eraser.addEventListener('click', ()=> {
    if(randomizerOn) randomizerOn= false;
    if(shadingToggled) shadingToggled= false;
    if(eraserOn == false){
        eraser.style.background = "salmon";
        eraserOn = true;
        selectedColor= "";
        randomizer.style.background = "";
        shadeToggle.style.background = "";
        shadingToggled = false;
    } 
    else{
        eraserOn = false;
        eraser.style.background = "";
        selectedColor= colorPicker.value;
    }
    
});

let shadingToggled = false;
shadeToggle.addEventListener('click', () => {
    // eraserOn = false;
    // eraser.style.background = "";
    // if(shadingToggled == false){
    //     shadeToggle.style.background = "salmon";
    //     selectedColor = colorPicker.value;
    //     shadingToggled = true;
    // } 
    // else{
    //     shadingToggled = false;
    //     shadeToggle.style.background = "";
    // }
    if(eraserOn){
        eraserOn = false;
        eraser.style.background = "";
    }
    if(randomizerOn){
        randomizerOn = false;
        randomizer.style.background = "";
        selectedColor = colorPicker.value;
    }
    if(shadingToggled){
        shadingToggled = false;
        shadeToggle.style.background = "";
    }
    else{
        shadingToggled=true;
        shadeToggle.style.background = "salmon";
    }
})


lineToggle.addEventListener('click', ()=> {
    let cells = document.querySelectorAll('.grid-cells');
    //Toggles the class that gives grid its lines with every click.
    for(let cell of cells){
        cell.classList.toggle('grid-lined');
    }
    if(toggledLines){
        toggledLines = false;
        lineToggle.style.background = "";
    } 
    else{
        lineToggle.style.background = "salmon";
        toggledLines = true;
    } 
    
});
colorPicker.addEventListener('click', () => {
    eraserOn = false;                                                                       
    eraser.style.background = "";
    selectedColor= colorPicker.value;
    randomizerOn = false;
    randomizer.style.background = "";
    selectedColor = colorPicker.value;
} );
colorPicker.addEventListener('change', () => {
    selectedColor = colorPicker.value;
    changedColor = true;
    selectedColor= colorPicker.value;
    randomizer.style.background = "";
    shadeToggle.style.background = "";
    shadingToggled = false;
} )
randomizer.addEventListener('click', () => {
    // eraserOn = false;
    // eraser.style.background = "";
    // selectedColor= colorPicker.value;
    // if(randomizerOn == false){
    //     randomizerOn = true;
    //     randomizer.style.background = "salmon"
    //     selectedColor = "random";
    //     shadeToggle.style.backgrou       nd = "";
    //     shadingToggled = false;
    // }
    // else{
    //     randomizerOn = false;
    //     randomizer.style.background = "";
    //     selectedColor = colorPicker.value;
    // }
    if(eraserOn){
        eraserOn = false;
        eraser.style.background = "";
    }
    if(shadingToggled){
        shadingToggled = false;
        shadeToggle.style.background = "";
    }
    if(randomizerOn){
        randomizerOn = false;
        selectedColor = colorPicker.value;
        randomizer.style.backgroundColor = "";
    }
    else{
        randomizerOn = true;
        randomizer.style.background = "salmon";
        selectedColor = "random";
        
    }
    
});

//eEND

let randomColor;
// Enables the color hover effect when mouse held and hovered/dragged or just clicks.
gridCon.addEventListener('mousedown', e => {
    randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    if(selectedColor=="random"){
            
        e.target.style.backgroundColor = randomColor;
        colorPicker.value = randomColor;
    }
    else{
        if(shadingToggled==false){
            e.target.style.backgroundColor = selectedColor
        }
            else if (shadingToggled==true && e.target.style.backgroundColor != ""){
            let hsl = getDarkerHSL(e.target.style.backgroundColor);
            e.target.style.backgroundColor = hsl;
        }
    }
   
    e.preventDefault();
    gridCon.addEventListener('mouseover', changeColor);
});

//Disables color hover effect when mousebutton released or pointer goes outside box
gridCon.addEventListener('mouseup', ()=>gridCon.removeEventListener('mouseover', changeColor));
gridCon.addEventListener('mouseleave', () => gridCon.removeEventListener('mouseover', changeColor));


//Handles the cell's change in color while holding mouse button and hovering
function changeColor(e){
    e.preventDefault();
    // let randomColor  = `rgb(${Math.random() *255},${Math.random() *255},${Math.random() *255})`;
    randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    //Change color of only individual cells. The whole grid or entire grid rows wont be colored by interacting with their borders
    if(e.target.classList.value == "grid-cells grid-lined" || e.target.classList.value == "grid-cells"){
        //If randomizer is toggled.
        if(selectedColor=="random"){
            
            e.target.style.backgroundColor = randomColor;
            colorPicker.value = randomColor;
        }
        // If not:
        else{
            //If shading untoggled, color cells with the selected color.
            if(shadingToggled==false) {
                e.target.style.backgroundColor = selectedColor;

            }
            // If shading toggled, darken cells that already have colors. Cells with no colors won't be affected. Background by default has no color and cant shaded
            else if(shadingToggled==true && e.target.style.backgroundColor != ""){
                let hsl = getDarkerHSL(e.target.style.backgroundColor);
                e.target.style.backgroundColor = hsl;
            }
                
                
        }
    }
}

//Resizes the grid if the value is within range. Deletes previous grid rows and cell before creating new grid
resizeBtn.addEventListener('click', ()=>{
    if(sizeBox.value <= 64 && sizeBox.value > 0 ){
        while(gridCon.firstElementChild) gridCon.removeChild(gridCon.firstElementChild);
        setGridSize(sizeBox.value);
        lineToggle.style.background = "salmon";
        toggledLines = true;
    }
    else{
        alert("Your input should be within the range 1-64");
        sizeBox.value = "";
        sizeBox.focus();
    } 
})

//Sets the gridsize according to the size provided by inputbox or the default when called
function setGridSize(size){
    for(let i=1; i<= size; i++){
        const row = document.createElement('div');
        row.setAttribute('id', `grid-row-${i}`);
        row.classList.add('grid-rows');
        gridCon.appendChild(row);
    }
    let gridRows = document.querySelectorAll('.grid-rows');
    for(let row of gridRows){
        for(let i = 1; i <= size; i++){
            const cell = document.createElement('div');
            cell.classList.add('grid-cells');
            cell.classList.add('grid-lined');
            row.appendChild(cell);
        }
    }    
}
// Gets a darker HSL value from RGB provided and returns it
function getDarkerHSL(rgbColor){
    //get R G B from rgb
    let rgbSplit = (rgbColor).split(",");
    let r = Number(rgbSplit[0].slice(4));
    let g = Number(rgbSplit[1].slice(1));
    let b = Number(rgbSplit[2].slice(1).replace(")",""));
    //RGB to range 0-1
    r =  parseFloat((r/255).toFixed(2));
    g = parseFloat((g/255).toFixed(2));
    b = parseFloat((b/255).toFixed(2));
    let rgbCombined = {red: r, green: g, blue: b};
    //Find min max
    let max = 0;
    let min = Infinity; 
    let maxKey;
    let minKey;
    for(let i = 0; i < 3; i++){
        if(max < Object.values(rgbCombined)[i]){
            max = Object.values(rgbCombined)[i];
            maxKey = Object.keys(rgbCombined)[i];
        }
        if(min > Object.values(rgbCombined)[i]){
            min = Object.values(rgbCombined)[i];
            minKey = Object.keys(rgbCombined)[i];
        }                
    }
    //Calculate Luminance(l)
    let l = parseFloat(((max+min)/2).toFixed(2));
    //Calculate Saturation(s)
    let s=0;
    if(max!=min) s = (l<=0.5)? (max-min)/(max+min) : (max-min)/(2.0-max-min);
    s = parseFloat(s.toFixed(2));
    //Calculate Hue(h)
    let h;
    switch(maxKey){
        case "red":
            h = (g-b)/(max-min);
            break;
        case "green":
            h = (2.0 + (b-r)/(max-min));
            break;
        case "blue":
            h = (4.0 + (r-g)/(max-min));
    }
    h *= 60;
    // Round up for accuracy
    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round((l-(l/10  )) * 100);
    // console.log(`RGB to HSL: hsl(${h}, ${s}, ${l})`);
    currentHSL = `hsl(${h}, ${s}%, ${l}%)`;
    return currentHSL;
}