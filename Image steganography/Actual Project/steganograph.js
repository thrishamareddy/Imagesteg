var operationModeOn = 0;        // 0 - image, 1 - text
console.log('dsdf');
function textMode(){
    if(operationModeOn == 0){
        //common changes
        document.getElementById("hideIMGcanvas").style.width = "0px";
        document.getElementById("hideIMGcanvas").style.height = "0px";
        document.getElementById("hideIMG").style.width = "0px";
        document.getElementById("hd").style.visibility = "hidden";
        document.getElementById("extractResultImgCanvas").style.width = "0px";
        document.getElementById("extractResultImgCanvas").style.height = "0px";
        document.getElementById("afterExtracting").innerHTML = " ";
        document.getElementById("extraction").style.visibility = "hidden";
        document.getElementById("downloadOriginal").style.visibility = "hidden";
        document.getElementById("downloadExtractedImageInHide").style.visibility = "hidden";
        document.getElementById("extractContext").style.marginTop = "-165vh";
        
        if(currentTask == 0){
           
        }else{  
           
        }

        operationModeOn = 1;
    }
}
function imageMode(){
    if(operationModeOn == 1){
        document.getElementById("hideIMGcanvas").style.width = "97.5%";
        document.getElementById("hideIMGcanvas").style.height = "55vh";
        document.getElementById("hideIMG").style.width = "70%";
        document.getElementById("hd").style.visibility = "visible";
        document.getElementById("extractResultImgCanvas").style.width = "97.5%";
        document.getElementById("extractResultImgCanvas").style.height = "77vh";
        document.getElementById("afterExtracting").innerHTML = "After extracting above image using my tool, output will be as follows: ";
        document.getElementById("extraction").style.visibility = "visible";
        document.getElementById("downloadOriginal").style.visibility = "visible";
        document.getElementById("downloadExtractedImageInHide").style.visibility = "visible";
        
        if(currentTask == 1){
            document.getElementById("extraction").style.visibility = "hidden";
            document.getElementById("downloadOriginal").style.visibility = "hidden";
        }
        if(currentTask == 0){
            document.getElementById("downloadExtractedImageInHide").style.visibility = "hidden";
        }
        operationModeOn = 0;
    }
}

   function clear3bits(colorVal){
        return Math.floor(colorVal/8) * 8;
   }
   function clear2bits(colorVal){
       return Math.floor(colorVal/4) * 4;
   }

    function steganographText(){
        var textToHide = document.getElementById("textToHide").value;

        textToHide = '&^--St4$:)[' + textToHide + ']:-($8Ts--^&';
        console.log("Text to hide: "+textToHide);

        var resultImg = new SimpleImage(start.getWidth(), start.getHeight());
        var idx = 0;
        var charCode;
        var r1, r2;
        var left2, middle3, right3;
        for(var pixelResult of resultImg.values()){
            var pixel = start.getPixel(pixelResult.getX(), pixelResult.getY());

            if(idx < textToHide.length){
                charCode = textToHide.charCodeAt(idx);
                r1 = Math.floor(charCode%8);
                right3 = r1;

                r2 = Math.floor(charCode % 64 - r1);
                middle3 = Math.floor(r2/8);

                left2 = Math.floor(( charCode % 256 - r2 ) / 64);
                
                console.log('lmr: '+left2+' '+middle3+' '+right3);
                pixelResult.setRed(clear2bits(pixel.getRed())+left2);
                pixelResult.setGreen(clear3bits(pixel.getGreen())+middle3);
                pixelResult.setBlue(clear3bits(pixel.getBlue())+right3);
               
        
            }else{
                pixelResult.setRed(pixel.getRed());
                pixelResult.setGreen(pixel.getGreen());
                pixelResult.setBlue(pixel.getBlue());

            }
            idx++;
        }
        var pixel = resultImg.getPixel(0,0);
        console.log('At 0,0 pixels RGB:'+pixel.getRed()+' '+pixel.getGreen()+' '+pixel.getBlue());
        var pixel = resultImg.getPixel(1,0);
        console.log('At 1,0 pixels RGB:'+pixel.getRed()+' '+pixel.getGreen()+' '+pixel.getBlue());
        return resultImg;
    }

    function extractText(){
        var extracted = '';
        var left2bits, middle3, right3;
        var value;
        var iterations=0;
        var shouldCheck = true;
        for(var pixel of givenImage.values()){
            iterations++;
            left2bits = pixel.getRed() % 4;
            middle3 = pixel.getGreen() % 8;
            right3 = pixel.getBlue() % 8;
            console.log('lmr: '+left2bits+' '+middle3+' '+right3);
            console.log('Pixel at x, '+pixel.getX()+' y, '+pixel.getY()+'; RGB: '+pixel.getRed()+' '+pixel.getGreen()+' '+pixel.getBlue());
            value = left2bits*64 + middle3*8 + right3;
            if(value <= 255){
                console.log(value+' : '+String.fromCharCode(value));
                extracted = extracted + String.fromCharCode(value);
            }
            if(shouldCheck && iterations > 15){
                if(extracted.includes('&^--St4$:)['))
                    shouldCheck = false;
                else
                    return 'Invalid photo, not a product from our site';
            }
            if(extracted.includes("]:-($8Ts--^&"))
                break;
        }
        extracted = extracted.substring(11,extracted.length-12);
        console.log('Output text: '+extracted);

        return extracted;
       
    }
//  Work with text


var coverChanged = 0;
var start;
var hide;
var startAsVanillaJsImage;
var extractFromAsVanillaJsImage;

var currentTask = 0;

function hideMode(){
    if(currentTask == 1){
        document.getElementById("extractContext").style.visibility = "hidden";
        document.getElementById("hideContext").style.visibility = "visible";
        document.getElementById("extraction").style.visibility = "visible";
        document.getElementById("downloadOriginal").style.visibility = "visible";
        document.getElementById("downloadExtractedImageInHide").style.visibility = "hidden";
        currentTask = 0;
    }
    if(operationModeOn == 1){
        document.getElementById("afterExtracting").innerHTML = " ";
        document.getElementById("extraction").style.visibility = "hidden";
        document.getElementById("downloadOriginal").style.visibility = "hidden";
    }

}
function extractMode(){
    if(currentTask == 0){
        document.getElementById("hideContext").style.visibility = "hidden";
        document.getElementById("extractContext").style.visibility = "visible";
        document.getElementById("extraction").style.visibility = "hidden";
        document.getElementById("downloadOriginal").style.visibility = "hidden";
        document.getElementById("downloadExtractedImageInHide").style.visibility = "visible";
        
        document.getElementById("extractContext").style.marginTop = "-165vh";
        
        currentTask = 1;
    }

}
function fetchSuitableWidthForCanvas(ImageHeight, ImageWidth, CanvasHeight){
    var ratio = CanvasHeight/ImageHeight;
    var result = ratio*ImageWidth;
    return result+"vh";
}
function fetchSuitableWidthForForm(ImageHeight, ImageWidth, CanvasHeight){
    var ratio = CanvasHeight/ImageHeight;
    var result = ratio*ImageWidth;
    result = result + 2;
    return result+"vh";
}
//
function uploadHIDE(){
    var hideCanvas = document.getElementById("hideIMGcanvas");
    var hideImageHolder = document.getElementById("hideIMG");
    hide = new SimpleImage(hideImageHolder);
    hide.drawTo(hideCanvas);
}

//console.log(steg);
var imgdatauri;
function readURL(input){
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        imgdatauri = e.target.result;
        console.log("imgdatauri(original):");
        console.log(imgdatauri);
      };
    }
    reader.readAsDataURL(input.files[0]);
}
function uploadINSIDE(inputForTextHandling){
    //readURL(inputForTextHandling);
    var startCanvas = document.getElementById("inthisIMGcanvas");
    var coverHolder = document.getElementById("inthisIMG");
    start = new SimpleImage(coverHolder);
    var h = start.getHeight();
    var w = start.getWidth();
    start.drawTo(startCanvas);
}
//



function loadCover(){
    var startCanvas = document.getElementById("inthisIMGcanvas");
    start = new SimpleImage("../../static/Photos/originalCover.jpg");
    start.drawTo(startCanvas);
}


function cropIMGs(){
    var x, y;
    
    var croppedHeight = hide.getHeight();
    var croppedWidth = hide.getWidth();

    var newCover = new SimpleImage(croppedWidth,croppedHeight);
     for(var pixel of newCover.values()){
   	    x = pixel.getX();
        y = pixel.getY();
        var oldPixel = start.getPixel(x,y);

        pixel.setRed(oldPixel.getRed());
        pixel.setBlue(oldPixel.getBlue());
        pixel.setGreen(oldPixel.getGreen()); 
     }
     start = newCover;
}

function clearBits(colorval){
    var x = Math.floor(colorval/16) * 16;
    return x;
}
function chop2hide(image){
    for(var pixel of image.values()){
        pixel.setRed(clearBits(pixel.getRed()));
        pixel.setGreen(clearBits(pixel.getGreen()));
        pixel.setBlue(clearBits(pixel.getBlue()));
    }
    return image;
}
function shift(image){
    for(var pixel of image.values()){
        pixel.setRed(pixel.getRed()/16);
        pixel.setGreen(pixel.getGreen()/16);
        pixel.setBlue(pixel.getBlue()/16);
    }
    return image;
}
function combine(show, hide){
    // do try cropping
    var answer = new SimpleImage(show.getWidth(), show.getHeight());
    
    for(var pixel of answer.values()){
        var x = pixel.getX();
        var y = pixel.getY();
        var showPixel = show.getPixel(x,y);
        var hidePixel = hide.getPixel(x,y);
        pixel.setRed(showPixel.getRed() + hidePixel.getRed());
        pixel.setGreen(showPixel.getGreen() + hidePixel.getGreen());
        pixel.setBlue(showPixel.getBlue() + hidePixel.getBlue());
    }
    return answer;
}
function extract(answer){
    var extracted = new SimpleImage(answer.getWidth(), answer.getHeight());
    var x;
    var y;
    for( var pixel of extracted.values()){
        x = pixel.getX();
        y = pixel.getY();
        var ansPixel = answer.getPixel(x,y);

        pixel.setRed( (ansPixel.getRed()%16) * 16 );
        pixel.setGreen( (ansPixel.getGreen()%16) * 16 );
        pixel.setBlue( (ansPixel.getBlue()%16) * 16 );
    }
    return extracted;
}
function dothestuff(){
    // All canvas obtained
    var resultCanvas = document.getElementById("resultCanvas");
    var extractCanvas = document.getElementById("extractionCanvas");
    if(operationModeOn == 1){
        // If text is operation mode:
        var result = steganographText();
        result.drawTo(resultCanvas);
        return;
    }

    if(  (hide.getHeight() > start.getHeight()) || (hide.getWidth() > start.getWidth())  ){
        alert("Resoultion of image to be hidden is greater than covering image :(");
        return;
    }
    else if( (hide.getHeight() != start.getHeight()) || (hide.getWidth() != start.getWidth())){
        cropIMGs();
        alert("Cover image cropped to match up the resolution of hidden image !");
    }
        
    

    //if(coverChanged > 0)
    start = chop2hide(start);
  
    
    hide = shift(hide);


    var result = combine(start,hide);
    result.drawTo(resultCanvas);
    
    var extracted = extract(result);
    extracted.drawTo(extractCanvas);

    var suitableWidthForResultCanvas = fetchSuitableWidthForCanvas(result.getHeight(), result.getWidth(), 72);
    var suitableWidthForExtractedCanvas = fetchSuitableWidthForCanvas(extracted.getHeight(), extracted.getWidth() , 72);
    
    document.getElementById("resultCanvas").style.width = suitableWidthForResultCanvas;
    document.getElementById("extractionCanvas").style.width = suitableWidthForExtractedCanvas;
    document.getElementById("resultCanvas").style.height="72vh";
    document.getElementById("extractionCanvas").style.height="72vh";
    document.getElementById("result").style.width = fetchSuitableWidthForForm(result.getHeight(), result.getWidth(), 72);
    document.getElementById("extraction").style.width = fetchSuitableWidthForForm(extracted.getHeight(), extracted.getWidth() , 72);
}
 

// Extraction code 
var givenImage, extractedImage;
function uploadExtractSrc(inputForExtracting){
    var givenCanvas = document.getElementById("extractSrcImgCanvas");
    var givenImageHolder = document.getElementById("extractSrcInput");
    givenImage = new SimpleImage(givenImageHolder);
    givenImage.drawTo(givenCanvas);
}
function doExtraction(){
    if(operationModeOn == 1){
        // If text is operation mode:
        var extractedText = extractText();
        document.getElementById("extractedText").innerHTML = extractedText;
        return;
    }

    var extractCanvas = document.getElementById("extractResultImgCanvas")
    extractedImage = extract(givenImage);
    extractedImage.drawTo(extractCanvas);
    document.getElementById("extractResultImgCanvas").style.height="75vh";
    document.getElementById("extractResultImgCanvas").style.width=fetchSuitableWidthForCanvas(extractedImage.getHeight(), extractedImage.getWidth(), 75);
    document.getElementById("extractResult").style.width = fetchSuitableWidthForForm(extractedImage.getHeight(), extractedImage.getWidth(), 75);
    
}




function download() {
    var download = document.getElementById("download");
    var image = document.getElementById("resultCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}
function downloadOriginalIMG(){
    var download = document.getElementById("downloadOriginal");
    var image = document.getElementById("extractionCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}
function downloadExtractedIMG(){
    var download = document.getElementById("downloadExtracted");
    var image = document.getElementById("extractResultImgCanvas").toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}