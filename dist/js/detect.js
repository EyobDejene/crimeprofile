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
      width: 700,
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
        console.log(resizedDetections);
        // new faceapi.draw.DrawFaceLandmarks(resizedDetections.landmarks, options).draw(canvas)
        //faceapi.draw.drawDetections(resizedDetections,options).draw(canvas);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);


        //faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 200);
      return false;
    });


}




