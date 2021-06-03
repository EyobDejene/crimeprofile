
function saveData(gender,age_cat,age,ethnicity,image) {


  let jsondata = {

    "gender": gender,
    "age_cat": age_cat,
    "age": age,
    "ethnicity": ethnicity,
    "image": image,
  };



  $.ajax({
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
    "data": JSON.stringify(jsondata),
    beforeSend: function(){
      // Show image container
      console.log('loading');
      document.querySelector('.page-loader').classList.remove('not-visible');
      document.querySelector('.page-loader').style.opacity=1;
      document.querySelector('.page-loader').style.display='block';
      document.querySelector('.page-loader .loader p').innerHTML = "Adding your face into the database...";

    },
    success: function(response) {
      console.log('saved data');
      setTimeout(function() {
        window.location = '/faces.html';
      },2000)

    },
    complete:function(data) {

    }

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
      document.querySelector('.faces-holder .loader').classList.remove('not-visible');

    },
     success: function(response) {

      if (response.length > 0) {
        // asc based on age
        console.log(response)
        let sortedData = response.slice(0, -1);

        sortedData = sortedData.sort(function(a, b) {
          return a.age - b.age;
        });


        if (sortedData.length > 0) {
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
          $('#face-objects').
              append("<p>No faces where found in the database..</p>");
        }
      }else{
        $('#face-objects').
            append("<p>No faces where found in the database..</p>");
      }

    },
    complete:function(data){
      // Hide image container
      console.log('completed');
      document.querySelector('.faces-holder .loader').classList.add('not-visible');
    }
  });
}



