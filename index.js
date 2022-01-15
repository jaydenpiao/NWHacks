window.onload=function(){
    document.getElementById("button").addEventListener("click",init);
} 
    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // model cloud link
    const URL = "https://teachablemachine.withgoogle.com/models/gSqPfZp0n/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
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
            if((i == (maxPredictions-1)))
                labelContainer.innerHTML = ans;
        }
    }