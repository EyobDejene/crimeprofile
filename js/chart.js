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
            "property crimes": Math.round(( item['property crimes'] / item['total'] *  100  ) - (100 /  3348350 * item['property crimes'])  ) ,
            "public-order crimes":  Math.round((item['public-order crimes']  / item['total'] * 100  ) - (100 /  3348350 * item['public-order crimes']) ),
            "violent crimes":  Math.round((item['violent crimes'] / item['total'] *  100 ) - (100 /  3348350 * item['violent crimes']) ),
            "traffic offenses":  Math.round((item['traffic offenses']  /  item['total']  * 100 ) - (100 /  3348350 * item['traffic offenses']) ),
            "drug offenses":  Math.round((item['drug offenses'] / item['total']  * 100  ) - (100 /  3348350 * item['drug offenses']) ),
            // vuurwapenmisdrijven: item['vuurwapenmisdrijven'],
          }
        });

        data = transformedData[0];

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




























