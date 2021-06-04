function getdataSet() {
  $.ajax({
    url: '../data/verdachten_geregisteerd.json',
    success: function(data) {

      console.log(data);

      const accumulateCrimes = (arr, prop) => arr.reduce(
          function(accumulator, currentValue) {
            return accumulator + currentValue[prop];
          }, 0);

      // function accumulateCrimes(arr, prop) {
      //   return arr.reduce((accumulator, currentValue) => {
      //     return accumulator + currentValue[prop];
      //   });
      // };

      const generateTotalObject = (arr, gender, ageGroup, background) => {
        return {
          "Geslacht": gender,
          "Leeftijd": ageGroup,
          "Migratieachtergrond": background,
          "Perioden": "2005-2014",
          "Totaal verdachten van misdrijven": null,
          "vermogensmisdrijven": accumulateCrimes(
              arr.filter(item => item.Migratieachtergrond === background),
              "vermogensmisdrijven"),
          "vernielingen": accumulateCrimes(
              arr.filter(item => item.Migratieachtergrond === background),
              "vernielingen"),
          "geweldsmisdrijven": accumulateCrimes(
              arr.filter(item => item.Migratieachtergrond === background),
              "geweldsmisdrijven"),
          "verkeersmisdrijven": accumulateCrimes(
              arr.filter(item => item.Migratieachtergrond === background),
              "verkeersmisdrijven"),
          "drugsmisdrijven": accumulateCrimes(
              arr.filter(item => item.Migratieachtergrond === background),
              "drugsmisdrijven")
        }
      };

      function getFilterdData(dataObject, age, gender, background) {
        const dataRaw = dataObject.filter(
            item => item.Leeftijd === age && item.Geslacht === gender &&
                item.Migratieachtergrond === background);
        data = dataRaw;
        return data;
      }

      function getCleanData(data, gender, age, background) {
        const filtererdData = getFilterdData(data, age, gender, background);
        const Object = generateTotalObject(filtererdData, gender, age,
            background);
        let sum = (Object.vermogensmisdrijven + Object.vernielingen +
            Object.geweldsmisdrijven + Object.verkeersmisdrijven +
            Object.drugsmisdrijven);
        return {
          "Geslacht": Object.Geslacht,
          "Leeftijd": Object.Leeftijd,
          "Migratieachtergrond": Object.Migratieachtergrond,
          "Perioden": Object.Perioden,
          "Totaal verdachten van misdrijven": sum,
          "vermogensmisdrijven": Object.vermogensmisdrijven,
          "vernielingen": Object.vernielingen,
          "geweldsmisdrijven": Object.geweldsmisdrijven,
          "verkeersmisdrijven": Object.verkeersmisdrijven,
          "drugsmisdrijven": Object.drugsmisdrijven
        }

      }

      let array = [
        // {gender:'Mannen',age:'Totaal verdachten',background:'Met migratieachtergrond'},
        // {gender:'Mannen',age:'12 tot 18 jaar',background:'Met migratieachtergrond'},
        // {gender:'Mannen',age:'18 tot 25 jaar',background:'Met migratieachtergrond'},
        // {gender:'Mannen',age:'25 tot 45 jaar',background:'Met migratieachtergrond'},
        // {gender:'Mannen',age:'45 tot 65 jaar',background:'Met migratieachtergrond'},
        // {gender:'Mannen',age:'65 jaar of ouder',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'Totaal verdachten',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'12 tot 18 jaar',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'18 tot 25 jaar',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'25 tot 45 jaar',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'45 tot 65 jaar',background:'Met migratieachtergrond'},
        // {gender:'Vrouwen',age:'65 jaar of ouder',background:'Met migratieachtergrond'},
      ];

      const newObject = [];
      for (const property in array) {

        newObject.push(
            getCleanData(data, array[property].gender, array[property].age,
                array[property].background));
      }

      console.log(newObject);

    },
    error: function(err) {
      console.log(err);
    }
  });
}