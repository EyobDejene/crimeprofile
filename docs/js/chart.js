let ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    // labels: labels,
    datasets: [
      {
        // label: '# of Votes',
        data: {},
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});



function getChart(dataFile,age,gender) {

  let data = null;


  $.ajax({
    url: dataFile,
    success: function(result) {
      data = result;
      // console.log('dtA: ', data);

      // var filter = {
      //   Leeftijd: '45 tot 65 jaar',
      //   Geslacht: 'Mannen'
      // };

      function getFilterdData(dataObject, age, gender) {
        const dataRaw = dataObject.filter(
            item => item.Leeftijd === age && item.Geslacht === gender);
        const transformedData = dataRaw.map(item => {
          return {
            vermogensmisdrijven: item['Totaal vermogensmisdrijven'],
            vernielingOpenbareOrde: item['Totaal vernieling en openbare orde'],
            geweldsmisdrijven: item['Totaal geweldsmisdrijven'],
            verkeersmisdrijven: item['Totaal verkeersmisdrijven'],
            drugsmisdrijven: item['Totaal verdachten van drugsmisdrijven'],
            vuurwapenmisdrijven: item['Totaal verdachten van vuurwapenmisdrijven'],
          }
        });

        data = transformedData;
        return data[0];
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
