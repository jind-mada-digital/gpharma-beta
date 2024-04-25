// Convert first letter after space to upper

const capitalize = (_sentence) => {
  let _word = _sentence.split(" ");
  for (let i = 0; i < _word.length; i++) {
    _word[i] = _word[i][0].toUpperCase() + _word[i].substr(1);
  }
  return _word.join(" ");
};
//End of Convert first letter after space to upper

//Convert english day and month to french

const convertEngDayMonth = (_textToConvert) => {
  let date = [
    {
      ang: "Monday",
      fr: "Lundi",
    },
    {
      ang: "Tuesday",
      fr: "Mardi",
    },
    {
      ang: "Wednesday",
      fr: "Mercredi",
    },
    {
      ang: "Thursday",
      fr: "Jeudi",
    },
    {
      ang: "Friday",
      fr: "Vendredi",
    },
    {
      ang: "Saturday",
      fr: "Samedi",
    },
    {
      ang: "Sunday",
      fr: "Dimanche",
    },
    {
      ang: "January",
      fr: "Janvier",
    },
    {
      ang: "February",
      fr: "Fevrier",
    },
    {
      ang: "March",
      fr: "Mars",
    },
    {
      ang: "April",
      fr: "Avril",
    },
    {
      ang: "May",
      fr: "Mai",
    },
    {
      ang: "June",
      fr: "Juin",
    },
    {
      ang: "Juillet",
      fr: "Juillet",
    },
    {
      ang: "August",
      fr: "Août",
    },
    {
      ang: "September",
      fr: "Septembre",
    },
    {
      ang: "October",
      fr: "Octobre",
    },
    {
      ang: "November",
      fr: "Novembre",
    },
    {
      ang: "December",
      fr: "Decembre",
    },
  ];
  let a = _textToConvert + "";
  for (let i = 0; i < date.length; i++) {
    a = a.replace(date[i].ang, date[i].fr);
  }
  return a;
};

module.exports = { capitalize, convertEngDayMonth };
