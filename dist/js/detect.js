var anchors = document.getElementsByTagName('a');
for(i=0, len=anchors.length; i<len; i++){
  anchors[i].addEventListener('click', function(e) {
    e.preventDefault();
    let url = this.getAttribute('href');
    window.location.href = url;
  });
}


function runDetection(state) {

    Webcam.set({
      width:500,
      height: 400,
      image_format: 'jpeg',
      jpeg_quality: 90
    });

    Webcam.attach('#my_camera');

    var kairos = new Kairos("app_id", "app_key");


    function myDetectCallback(response) {

      document.getElementById(
          "kairos_response").innerHTML = response.responseText;

      $response = $("#kairos_response");
      $response.removeClass("modal");

      var kairosJSON = JSON.parse(response.responseText);
      if (!kairosJSON.images[0].faces[0]) {
        console.log('no images in face response');
        return;
      }

      document.getElementById("kairos_response").innerHTML = JSON.stringify(
          kairosJSON, null, "\t");

      //console.log(kairosJSON.images[0].faces[0]);
      const age         = kairosJSON.images[0].faces[0].attributes.age;
      const ageConf     = kairosJSON.images[0].faces[0].quality;
      const gender      = kairosJSON.images[0].faces[0].attributes.gender.type;
      const genderMConf = kairosJSON.images[0].faces[0].attributes.gender.maleConfidence;
      const genderFConf = kairosJSON.images[0].faces[0].attributes.gender.femaleConfidence;
      const asianConf   = kairosJSON.images[0].faces[0].attributes.asian;
      const hispanicConf   = kairosJSON.images[0].faces[0].attributes.hispanic;
      const blackConf   = kairosJSON.images[0].faces[0].attributes.black;
      const whiteConf   = kairosJSON.images[0].faces[0].attributes.white;
      const otherConf   = kairosJSON.images[0].faces[0].attributes.other;


      // gender
      let genderField = document.querySelector('.gender-analyzer .td-value');
      let genderBar   = document.querySelector('.gender-analyzer .bar');
      let genderConfPercentage = document.querySelector('.gender-analyzer  .td-value-percentage');
      let genderinFile = ""

      if(gender == "M") {
        genderinFile = "Mannen";
        genderField.innerHTML = "Male";
        genderConfPercentage.innerHTML = genderMConf * 100 +'%';
        genderBar.style.width = genderMConf * 100 +'%';
      }else{
        genderinFile = "Vrouwen";
        genderField.innerHTML = "Female";
        genderConfPercentage.innerHTML = genderFConf * 100 +'%';
        genderBar.style.width = genderFConf * 100 +'%';
      }





      // age
      let ageField = document.querySelector('.age-analyzer .td-value');
      let ageBar   = document.querySelector('.age-analyzer .bar');
      let ageConfPercentage = document.querySelector('.age-analyzer .td-value-percentage');

      ageField.innerHTML = age;
      ageBar.style.width = ageConf * 34 +'%';
      ageConfPercentage.innerHTML = Math.round(ageConf * 30) +'%';



      // ethnicity
      let ethnicityField = document.querySelector('.ethnicity-analyzer .td-value');
      let ethnicityBar   = document.querySelector('.ethnicity-analyzer .bar');
      let ethnicityConfPercentage = document.querySelector('.ethnicity-analyzer .td-value-percentage');
      let arrayEthnicity = {"black":blackConf, "white":whiteConf, "asian":asianConf,"hispanic":hispanicConf,"other":otherConf};
      let highestConf = Object.keys(arrayEthnicity).reduce(function(a, b){ return arrayEthnicity[a] > arrayEthnicity[b] ? a : b });



      console.log(arrayEthnicity[highestConf]);
      ethnicityBar.style.width =  Math.round(arrayEthnicity[highestConf] * 100) +'%';
      ethnicityConfPercentage.innerHTML = Math.round(arrayEthnicity[highestConf] * 100) +'%';


      function round(input){
        Math.round((input) * 100) / 10;
      }

      function between(x, min, max) {
        return x >= min && x <= max;
      }


      let Objectage = "";

      if (between(age,12, 18)) {
          Objectage = "12 tot 18 jaar";
      }else if(between(age,18, 25)){
          Objectage = "18 tot 25 jaar";
      }else if(between(age,25, 45)){
          Objectage = "25 tot 45 jaar";
      }else if(between(age,45, 65)){
          Objectage = "45 tot 65 jaar";
      }else if(age >= 65){
          Objectage = "65 jaar of ouder";
      }

      console.log(highestConf);
      if(highestConf == "white"){
        ethnicityField.innerHTML =  "None migration background";
        getChart('../data/dm.json',Objectage,genderinFile);

      }else if(highestConf == "black"){
        ethnicityField.innerHTML =  "Migration background";
        getChart('../data/mm.json',Objectage,genderinFile);

      }else if(highestConf == "asian"){
        ethnicityField.innerHTML =  "Non-western migration background";
        getChart('../data/nwm.json',Objectage,genderinFile);

      }else if(highestConf == "hispanic"){
        ethnicityField.innerHTML =  "Western migration background";
        getChart('../data/wm.json',Objectage,genderinFile);

      }
      else if(highestConf == "other"){
        ethnicityField.innerHTML =  "Unknown migration background";
        getChart('../data/other.json',Objectage,genderinFile);
      }





      // call custom drawing method
      // myDrawMethod(kairosJSON.images[0].faces[0]);
    }

    function snap() {
      console.log('snapshot');
      Webcam.snap(function(data_uri) {
        // display results in page
        // console.log(data_uri);
        var options = {"selector": "FULL"};
        kairos.detect(data_uri, myDetectCallback, options);

      });
    }

    navigator.getMedia = (navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia({video: true}, function() {
      // webcam is available

      console.log(state);
       window.setInterval(function() {
        if(state){
          snap();
        }
      }, 1000);


    }, function() {
      // webcam is not available
    });

    const video = document.querySelector('#my_camera video');

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo);

    function startVideo() {
      navigator.getUserMedia(
          {video: {}},
          stream => video.srcObject = stream,
          err => console.error(err)
      )
    }

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      video.parentNode.insertBefore(canvas, video.nextSibling);

      const displaySize = {width: video.offsetWidth, height: video.offsetHeight}

      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).
            withFaceLandmarks().
            withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections,
            displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        const options = { boxColor: "#ff0018" }
        //console.log(resizedDetections);
        // new faceapi.draw.DrawFaceLandmarks(resizedDetections.landmarks, options).draw(canvas)
        //faceapi.draw.drawDetections(resizedDetections,options).draw(canvas);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawDetections(canvas,resizedDetections)


        //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 200);
      return false;
    });


}




