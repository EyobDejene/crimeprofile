var anchors = document.getElementsByTagName('a');
for(i=0, len=anchors.length; i<len; i++){
  anchors[i].addEventListener('click', function(e) {
    e.preventDefault();
    let url = this.getAttribute('href');
    window.location.href = url;
  });
}


function runDetection(state) {

    // Webcam.set({
    //   width:'420',
    //   height: '300',
    //   image_format: 'jpeg',
    //   jpeg_quality: 90
    // });



    var kairos = new Kairos("app_id", "app_key");


    function myDetectCallback(response) {

      document.getElementById(
          "kairos_response").innerHTML = response.responseText;

      $response = $("#kairos_response");
      $response.removeClass("modal");

      var kairosJSON = JSON.parse(response.responseText);
      console.log(kairosJSON);
      if (!kairosJSON.images) {
        console.log('no images in face response');
        document.querySelector('.save-data').classList.add('disabled');

        let msg = "Frame your face and wait for us to recognize it. This can take a few seconds. Make sure there is enough light, do not cover your mouth and make sure that only one person is in the picture.";
        notify(msg);


        return;
      }else{

          closeNotifyAuto();
          document.querySelector('.save-data').classList.remove('disabled');
      }

      document.getElementById("kairos_response").innerHTML = JSON.stringify(
          kairosJSON, null, "\t");

      //console.log(kairosJSON.images[0].faces[0]);
      const age         = kairosJSON.images[0].faces[0].attributes.age;
      const ageConf     = kairosJSON.images[0].faces[0].quality;
      const gender      = kairosJSON.images[0].faces[0].attributes.gender.type;
      const genderMConf = kairosJSON.images[0].faces[0].attributes.gender.maleConfidence;
      const genderFConf = kairosJSON.images[0].faces[0].attributes.gender.femaleConfidence;
      const asianConf    = kairosJSON.images[0].faces[0].attributes.asian;
      const hispanicConf = kairosJSON.images[0].faces[0].attributes.hispanic;
      const blackConf   = kairosJSON.images[0].faces[0].attributes.black;
      const whiteConf   = kairosJSON.images[0].faces[0].attributes.white;
      const otherConf   = kairosJSON.images[0].faces[0].attributes.other;


      // gender
      let genderField = document.querySelector('.gender-analyzer .td-value');
      let genderBar   = document.querySelector('.gender-analyzer .bar');
      let genderConfPercentage = document.querySelector('.gender-analyzer  .td-value-percentage');
      let genderinFile = "";

      if(gender == "M") {
        genderinFile = "males";
        genderField.innerHTML = "male";
        genderConfPercentage.innerHTML = Math.round((genderMConf * 45) / 0.4534) +'%';
        genderBar.style.width = Math.round((genderMConf * 45) / 0.4534)+'%';
      }else{
        genderinFile = "females";
        genderField.innerHTML = "female";
        genderConfPercentage.innerHTML = Math.round(genderFConf * 45 / 0.4534) +'%';
        genderBar.style.width = Math.round(genderFConf * 45 / 0.4534) +'%';
      }


      // age
      let ageField = document.querySelector('.age-analyzer .td-value');
      let ageBar   = document.querySelector('.age-analyzer .bar');
      let ageConfPercentage = document.querySelector('.age-analyzer .td-value-percentage');

      ageField.innerHTML = age;
      console.log(ageConf);
      ageBar.style.width = ageConf * 60 +'%';
      ageConfPercentage.innerHTML = Math.round(ageConf * 60) +'%';


      // ethnicity
      let ethnicityField = document.querySelector('.ethnicity-analyzer .td-value');
      let ethnicityBar   = document.querySelector('.ethnicity-analyzer .bar');
      let ethnicityConfPercentage = document.querySelector('.ethnicity-analyzer .td-value-percentage');
      let arrayEthnicity = {"black":blackConf, "white":whiteConf, "asian":asianConf,"hispanic":hispanicConf,"other":otherConf};
      let highestConf = Object.keys(arrayEthnicity).reduce(function(a, b){ return arrayEthnicity[a] > arrayEthnicity[b] ? a : b });



      console.log(arrayEthnicity[highestConf]);
      ethnicityBar.style.width =  Math.round(arrayEthnicity[highestConf] * 45 / 0.5313) +'%';
      ethnicityConfPercentage.innerHTML = Math.round(arrayEthnicity[highestConf] * 45 / 0.5313) +'%';


      function round(input){
        Math.round((input) * 100) / 10;
      }

      function between(x, min, max) {
        return x >= min && x <= max;
      }


      let Objectage = "";

      if (between(age,12, 18)) {
          Objectage = "12-18";
          document.querySelector('.age-category').innerHTML = Objectage;
      }else if(between(age,18, 25)){
          Objectage = "18-25";
          document.querySelector('.age-category').innerHTML = Objectage;
      }else if(between(age,25, 45)){
          Objectage = "25-45";
           document.querySelector('.age-category').innerHTML = Objectage;
      }else if(between(age,45, 65)){
          Objectage = "45-65";
          document.querySelector('.age-category').innerHTML = Objectage;
      }else if(age >= 65){
          Objectage = "65-65+";
          document.querySelector('.age-category').innerHTML = Objectage;
      }

      // console.log(highestConf);
      if(highestConf == "white"){
        let ethnicity =  "dutch background";
        ethnicityField.innerHTML = highestConf;
        getChart('../data/aanhoudingen/NA_verdachten_aanhoudingen.json',Objectage,genderinFile);
          document.querySelector('.gender-category').innerHTML = genderinFile;
          document.querySelector('.ethnicity-category').innerHTML = ethnicity;

      }else if(highestConf == "black"){
        let ethnicity = "migration background";
            ethnicityField.innerHTML = highestConf;
        getChart('../data/aanhoudingen/MMA_verdachten_aanhoudingen.json',Objectage,genderinFile);
          document.querySelector('.gender-category').innerHTML = genderinFile;
          document.querySelector('.ethnicity-category').innerHTML = ethnicity;

      }else if(highestConf == "asian"){
        let ethnicity ="non-western migration background";
            ethnicityField.innerHTML =  highestConf;
        getChart('../data/aanhoudingen/NWMA_verdachten_aanhoudingen.json',Objectage,genderinFile);
          document.querySelector('.gender-category').innerHTML = genderinFile;
          document.querySelector('.ethnicity-category').innerHTML = ethnicity;

      }else if(highestConf == "hispanic"){
        let ethnicity = "western migration background";
            ethnicityField.innerHTML = highestConf;
        getChart('../data/aanhoudingen/WMA_verdachten_aanhoudingen.json',Objectage,genderinFile);
          document.querySelector('.gender-category').innerHTML = genderinFile;
          document.querySelector('.ethnicity-category').innerHTML = ethnicity;

      }
      else if(highestConf == "other"){
        let ethnicity = "unknown migration background";
            ethnicityField.innerHTML = highestConf;
        getChart('../data/aanhoudingen/OMA_verdachten_aanhoudingen.json',Objectage,genderinFile);
          document.querySelector('.gender-category').innerHTML = genderinFile;
          document.querySelector('.ethnicity-category').innerHTML = ethnicity;

      }



      // call custom drawing method
      // myDrawMethod(kairosJSON.images[0].faces[0]);
    }

    function snap() {
      console.log('snapshot');

      // getChart('../data/geregistreerd/MMA_verdachten_geregistreerd.json','12 tot 18 jaar','Vrouwen');


      // let ethnicity = "dutch background";
      // let Objectage = "65-65+";
      // let genderinFile = "females";

     // getChart('../data/aanhoudingen/MMA_verdachten_aanhoudingen.json',Objectage,genderinFile);
     //   document.querySelector('.gender-category').innerHTML = genderinFile;
     //   document.querySelector('.ethnicity-category').innerHTML = ethnicity;
     //  document.querySelector('.age-category').innerHTML = Objectage;

      Webcam.snap(function(data_uri) {
        // display results in page
        console.log(data_uri);
        var options = {"selector": "FULL"};
        kairos.detect(data_uri, myDetectCallback, options);

      });
    }



  let constraints = { audio: false, video: true };
  navigator.mediaDevices.getUserMedia(constraints).then(function(){
      // webcam is available
      // Webcam.attach('#my_camera');
      console.log(state);
       window.setInterval(function() {
        if(state){
          snap();
        }
      }, 6000);


    }, function() {
      // webcam is not available
      // let msg = "No camera has been detected. Check your browser settings and reload the page." +
      //     "This application currently only works when a camera is available. An upload function will be available in the near future. ";
      // notify(msg);


    });

    const video = document.querySelector('#my_camera video');

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(window.location.host+'/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri(window.location.host+'/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri(window.location.host+'/models'),
      faceapi.nets.faceExpressionNet.loadFromUri(window.location.host+'/models')
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
        // console.log('node maded');
        // console.log(video.querySelectorAll('canvas').length)
        //canvas.parentNode.insertBefore(video, canvas.nextSibling);
        // let videoElements = document.querySelectorAll('video').length;
        //video.insertBefore(canvas,video.nextSibling);
        //  video.parentNode.insertBefore(canvas, video.childNodes[0]);

        const displaySize = {
          width: video.offsetWidth,
          height: video.offsetHeight
        }

        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video,
              new faceapi.TinyFaceDetectorOptions()).
              withFaceLandmarks().
              withFaceExpressions()
          const resizedDetections = faceapi.resizeResults(detections,
              displaySize);

          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

          //console.log(resizedDetections);
          // new faceapi.draw.DrawFaceLandmarks(resizedDetections.landmarks, options).draw(canvas)
          //faceapi.draw.drawDetections(resizedDetections,options).draw(canvas);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          faceapi.draw.drawDetections(canvas, resizedDetections)

          //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        }, 200);
        return false;
    });



}





function snapData(state){

  Webcam.snap(function(data_uri) {

    let gender = document.querySelector('.gender-category').innerHTML;
    let age_cat = document.querySelector('.age-category').innerHTML;
    let age = document.querySelector('.age-analyzer .td-value').innerHTML;
    let ethnicity = document.querySelector('.ethnicity-analyzer .td-value').innerHTML;

    localStorage.setItem('image', data_uri);
    localStorage.setItem('gender', gender);
    localStorage.setItem('age_cat', age_cat);
    localStorage.setItem('age', age);
    localStorage.setItem('ethnicity', ethnicity);


    if(state){
      saveData(gender,age_cat,age,ethnicity,data_uri)
    }else{
      window.location = 'faces.html';
    }

  });






}




