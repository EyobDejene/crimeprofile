let ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {


  type: 'bar',
  data: {
    // labels: labels,
    datasets: [
      {

        data: {},
        // borderColor: 'red',
        // backgroundColor:\,
       // backgroundColor:['linear-gradient(to right,#fff 20%,transparent 20%,transparent 100%)'],

        backgroundColor: [
        //   'linear-gradient(90deg, red 1%, transparent 1%) 1px 0, red',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          // 'rgba(255, 255, 255, 1)'
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,


      }]
  },

  options: {
    onClick: handleClick,

    plugins: {
      legend: {
        display: false,
        labels: {
          color: 'rgb(255, 99, 132)'
        }
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            var label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label +=  context.parsed.y +'%';
            }
            return label;
          }
        }
      }


    },


    scales: {
      y: {
        ticks: {
          color: "rgba(255,255,255,1)",
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return value + '%';
          }
        }
      },
      x:{
        ticks: {

            fontFamily: "Ibm-3270",

          // Include a dollar sign in the ticks
          // maxRotation: 75,
          // minRotation: 75,
          padding:0,
          color: "rgba(255,255,255,1)",
          font: {
            size: 12,
          }
        }
      }
    },

    tooltips: {
      mode: 'label',
      callbacks: {
        title: function(tooltipItems, data) {
          return data.labels[tooltipItems.index] + ' ';
        }
      }
    },


  },

});



function getChart(dataFile,age,gender) {

  let data = null;


  $.ajax({
    url: dataFile,
    success: function(result) {
      data = result;
      // console.log('dtA: ', data);

      // var filter = {
      //   age: '45 tot 65 jaar',
      //   gender: 'Mannen'
      // };

      function getFilterdData(dataObject, age, gender) {
        const dataRaw = dataObject.filter(
            item => item.age === age && item.gender === gender);
        const transformedData = dataRaw.map(item => {
          return {
            // "property crimes": Math.round(( item['property crimes'] / item['total'] *  100  ) - (100 /  3348350 * item['property crimes'])  ) ,
            // "public-order crimes":  Math.round((item['public-order crimes']  / item['total'] * 100  ) - (100 /  3348350 * item['public-order crimes']) ),
            // "violent crimes":  Math.round((item['violent crimes'] / item['total'] *  100 ) - (100 /  3348350 * item['violent crimes']) ),
            // "traffic offenses":  Math.round((item['traffic offenses']  /  item['total']  * 100 ) - (100 /  3348350 * item['traffic offenses']) ),
            // "drug offenses":  Math.round((item['drug offenses'] / item['total']  * 100  ) - (100 /  3348350 * item['drug offenses']) ),
            //

            "property crimes":(100 /  3348350 * item['property crimes']).toFixed(2) ,
            "public-order crimes": (100 /  3348350 * item['public-order crimes']).toFixed(2),
            "violent crimes":  (100 /  3348350 * item['violent crimes'] ).toFixed(2),
            "traffic offenses":  (100 /  3348350 * item['traffic offenses']).toFixed(2),
            "drug offenses": (100 /  3348350 * item['drug offenses']).toFixed(2),

          }
        });

        data = transformedData[0];

        console.log("dataa",  data);

        var max = Math.max.apply(null,Object.keys(data).map(function(x){ return data[x] }));
        let key = Object.keys(data).filter(function(x){ return data[x] == max; })[0];
        let category = key;
        let value = data[key];


        document.querySelector('.risk-percentage').innerHTML = value + '%';
        document.querySelector('.crime-category').innerHTML = category;
        document.querySelector('.age-category').innerHTML = age;


        return data;
      }

     // console.log(getFilterdData(data, age, gender));
      console.log(myChart);
      myChart.data.datasets[0].data = getFilterdData(data, age, gender);
      myChart.update();

    },
    error: function(err) {
      console.log(err);
    }
  });


}

function handleClick(e) {
  let nearest = myChart.getElementsAtEventForMode(e, 'nearest', {intersect: false, axis: 'x'});
    let labelX = myChart.scales.x.ticks;
    let bar = nearest[0].index;
    let selectedBar  = labelX[bar].label;
    console.log();
    if(selectedBar == 'property crimes'){
      let msg = selectedBar+'<br><br>All registered property crime suspects. Property crimes include all forms of theft and burglary. In addition, embezzlement, fraud, forgery, extortion, bankruptcy and money laundering fall into this category of crimes. This includes all forms of theft and burglary. In addition, embezzlement, fraud, forgery, extortion, bankruptcy and money laundering fall into this category of crimes.<br><br>' +
          'It concerns the suspicious persons who are registered in the registration systemBasis Voorziening Handhaving (BVH) between 2005 - 2014.';
      notify(msg,true);

    }else if(selectedBar == 'public-order crimes'){
      let msg = selectedBar+'<br><br>All registered suspects of vandalism and public order crimes. This includes arson, all forms of vandalism and crimes against public order and public authority. Examples of crimes against public order and against public authority are sedition, burglary of the home, computer and premises, participation in a criminal or terrorist organization, open assault, blasphemy, discrimination and making a false report.<br><br>' +
          'It concerns the suspicious persons who are registered in the registration systemBasis Voorziening Handhaving (BVH) between 2005 - 2014.';
      notify(msg,true);
    }else if(selectedBar == 'violent crimes'){
      let msg = selectedBar+'<br><br>All suspects of violent crimes. Violent crimes include all sexual crimes, including rape, assault and fornication. It also concerns life crimes, such as murder and manslaughter, assisted suicide, euthanasia and abortion. This category also includes culpable death and physical injury, threats, assault, theft with violence and extortion.<br><br>' +
          'It concerns the suspicious persons who are registered in the registration systemBasis Voorziening Handhaving (BVH) between 2005 - 2014.';
      notify(msg,true);
    }else if(selectedBar == 'traffic offenses'){
      let msg = selectedBar+'<br><br>All registered traffic crime suspects.<br><br>' +
          'The 1994 Road Traffic Act is the basis for road traffic regulations in the Netherlands. This law describes what traffic offenses (crime or violation) are. The figures presented in this table relate exclusively to crimes. The most common traffic offenses are drunk driving and accident abandonment.<br><br>'+
          'It concerns the suspicious persons who are registered in the registration systemBasis Voorziening Handhaving (BVH) between 2005 - 2014.';
      notify(msg,true);
    }else if(selectedBar == 'drug offenses'){
      let msg = selectedBar+'<br><br>All registered drug suspects.<br><br>' +
          'The Opium Act regulates the investigation, prosecution and trial of acts related to (prohibited) drug possession and drug trafficking. The law distinguishes between crimes and violations. Under the Opium Act, it is prohibited to prepare, process, process, sell, deliver, provide, transport or have available substances that are mentioned on the so-called list I (hard drugs) and list II (soft drugs). Examples of the substances referred to here are cocaine, heroin, methadone, morphine, opium and hemp. The figures presented in this table relate exclusively to crimes.<br><br>'+
          'It concerns the suspicious persons who are registered in the registration systemBasis Voorziening Handhaving (BVH) between 2005 - 2014.';
      notify(msg,true);

    }


}


























