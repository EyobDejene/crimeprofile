
function saveData(gender,age_cat,age,ethnicity,image) {
  var jsondata = {

    "gender": gender,
    "age_cat": age_cat,
    "age": age,
    "ethnicity": ethnicity,
    "image": image,
  };

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://mugshots-fb45.restdb.io/rest/face",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "60b3a6b1318a330b62f5887d",
      "cache-control": "no-cache"
    },
    "processData": false,
    "data": JSON.stringify(jsondata)
  }

  $.ajax(settings).done(function(response) {
    console.log(response);
    window.location = '/faces.html';
  });
}



function getFaces(gender,age_cat,age,ethnicity){

  let node = document.getElementById("face-objects");
  node.querySelectorAll('*').forEach(n => n.remove());


  $.ajax({
    "async": true,
    "crossDomain": true,
    "url": "https://mugshots-fb45.restdb.io/rest/face?q={%22gender%22:%22"+gender+"%22,%22age_cat%22:%22"+age_cat+"%22,%22ethnicity%22:%22"+ethnicity+"%22}",
    "method": "GET",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "60b3a6b1318a330b62f5887d",
      "cache-control": "no-cache"
    },
    beforeSend: function(){
      // Show image container
      console.log('loading');
      document.querySelector('.loader').classList.remove('not-visible');

    },
     success: function(response) {
      if (response.length > 0) {
        // asc based on age
        console.log(response)
        let sortedData = response.sort(function(a, b) {
          return a.age - b.age;
        });

        for (obj in sortedData) {
          console.log(obj);
          $('#face-objects').append("" +
              "<div class='col-2 mugshots'>" +
              "<div class='image-holder'>" +
              "<img src=" + "'" + sortedData[obj].image + "'/>" +
              "</div>" +
              "</div>");
        }
      } else {
        $('#face-objects').append("<p>No faces where found in the database..</p>");
      }
    },
    complete:function(data){
      // Hide image container
      console.log('completed');
      //document.querySelector('.loader').classList.add('not-visible');
    }
  });
}



