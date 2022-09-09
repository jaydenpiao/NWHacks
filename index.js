window.onload=function(){
    document.getElementById("button").addEventListener("click",init);
} 
    // model cloud link
    const URL = "https://teachablemachine.withgoogle.com/models/5TSkn9Dl5/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(550,350, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        let maxprob = 0;
        let ans = "";
        for (let i = 0; i < maxPredictions; i++) {
            if(prediction[i].probability.toFixed(2) > maxprob){
                maxprob = prediction[i].probability.toFixed(2);
                ans = prediction[i].className;
            }
            //const classPrediction = ans;
            //const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            //labelContainer.childNodes[i].innerHTML = ans;
            if((i == (maxPredictions-1))){
                const currString = labelContainer.innerHTML;
                if(currString.slice(-1) != ans){
                    if(ans == "space")
                      labelContainer.innerHTML+=" ";
                    else
                      labelContainer.innerHTML+= ans;
                }
            }
        }
    }