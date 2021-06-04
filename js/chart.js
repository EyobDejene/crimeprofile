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
      let msg = selectedBar+'<br><br>Alle geregistreerde verdachten van vermogensmisdrijven. Onder vermogensmisdrijven vallen alle vormen van diefstal en inbraak. Daarnaast vallen verduistering, bedrog, valsheidsmisdrijven, afpersing, bankbreuk en witwassen in deze categorie misdrijven. Hieronder vallen alle vormen van diefstal en inbraak. Daarnaast vallen verduistering, bedrog, valsheidsmisdrijven, afpersing, bankbreuk en witwassen in deze categorie misdrijven.<br><br>' +
          'Het betreft de verdachte personen die geregistreerd zijn in het registratiesysteem Basis Voorziening Handhaving (BVH) van de politie.';
      notify(msg,true);

    }else if(selectedBar == 'public-order crimes'){
      let msg = selectedBar+'<br><br>Alle geregistreerde verdachten van vernieling en openbare orde misdrijven. Hieronder vallen brandstichting, alle vormen van vernieling en misdrijven tegen de openbare orde en het openbaar gezag. Voorbeelden van misdrijven tegen de openbare orde en tegen het openbaar gezag zijn opruiing, huis-, computer- en lokaalvredebreuk, deelneming aan een criminele of terroristische organisatie, openlijke geweldpleging, godslastering, discriminatie en het doen van een valse aangifte. <br><br>' +
        'Het betreft de verdachte personen die geregistreerd zijn in het registratiesysteem Basis Voorziening Handhaving (BVH) van de politie.';
      notify(msg,true);
    }else if(selectedBar == 'violent crimes'){
      let msg = selectedBar+'<br><br>Alle verdachten van geweldsmisdrijven. Onder geweldsmisdrijven vallen alle seksuele misdrijven, waaronder verkrachting, aanranding en ontucht. Daarnaast gaat het om levensdelicten, zoals moord en doodslag, hulp bij zelfdoding, euthanasie en abortus. Ook dood en lichamelijk letsel door schuld, bedreiging, mishandeling, diefstal met geweld en afpersing horen bij deze categorie.<br><br>' +
          'Het betreft de verdachte personen die geregistreerd zijn in het registratiesysteem Basis Voorziening Handhaving (BVH) van de politie.';
      notify(msg,true);
    }else if(selectedBar == 'traffic offenses'){
      let msg = selectedBar+'<br><br>Alle geregistreerde verdachten van verkeersmisdrijven.<br><br>' +
          'De Wegenverkeerswet 1994 is de basis voor de regelgeving van het wegverkeer in Nederland. In deze wet staat beschreven wat verkeersdelicten (misdrijf of overtreding) zijn. De in deze tabel gepresenteerde cijfers hebben uitsluitend betrekking op misdrijven. De meest voorkomende verkeersmisdrijven zijn rijden onder invloed en verlaten plaats ongeval.<br><br>'+
          'Het betreft de verdachte personen die geregistreerd zijn in het registratiesysteem Basis Voorziening Handhaving (BVH) van de politie.';
      notify(msg,true);
    }else if(selectedBar == 'drug offenses'){
      let msg = selectedBar+'<br><br>Alle geregistreerde verdachten van drugsmisdrijven.<br><br>' +
          'De Opiumwet regelt de opsporing, vervolging en berechting van handelingen die te maken hebben met (verboden) drugsbezit en drugshandel. De wet maakt onderscheid tussen misdrijven en overtredingen. Op grond van de Opiumwet geldt een verbod op het bereiden, bewerken, verwerken, verkopen, afleveren, verstrekken, vervoeren of aanwezig hebben van middelen die genoemd worden op de zogeheten lijst I (harddrugs) en lijst II (softdrugs). Voorbeelden van de hier bedoelde stoffen zijn cocaïne, heroïne, methadon, morfine, opium en hennep. De in deze tabel gepresenteerde cijfers hebben uitsluitend betrekking op misdrijven.<br><br>'+
          'Het betreft de verdachte personen die geregistreerd zijn in het registratiesysteem Basis Voorziening Handhaving (BVH) van de politie. ';
      notify(msg,true);

    }


}


























