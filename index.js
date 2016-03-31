//INDEX.JS

//DECLARE GLOBAL VARS
var units = "imperial";
var imgs = [
  'url("http://goo.gl/ZDeHnb")',		//HOT
  'url("https://goo.gl/KikcZ3")',		//WARM/CLEAR
  'url("http://goo.gl/1MKlb0")',		//COLD
  'url("https://goo.gl/8arWGH")',		//FREEZING
];
var Coordinates = function(lat, lon) {
  this.latitude = lat;
  this.longitude = lon;
};

var coord = new Coordinates(0, 0);

function getLocation() {
  // CHECK IF USER ALLOWED NAVIGATOR/BROWSER TO FETCH LOCATION 
  var display = document.getElementById("weather");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    display.innerHTML = "Geolocation was not given.";
  }
};

function showPosition(position) {
  // STORE AS GLOBAL VARS
  coord.latitude = position.coords.latitude;
  coord.longitude = position.coords.longitude;
  callWeatherAPI();
};

function getURL(lat, lon, units) {
  // HAVE API KEY READY FOR CALL USING CUSTOM URL FOR OPEANWEATHERMAP
  var appid = "f05a43ebe4f579a76d759f38e033a4bb";
  return "http://api.openweathermap.org/data/2.5/weather?lat=" + lat +
    "&lon=" +
    lon + "&units=" + units + "&appid=" + appid;
};

function callWeatherAPI() {
  //CALL THE ACTUAL API/FETCH JSON OBJECT
  var url = getURL(coord.latitude, coord.longitude, units);
  $.getJSON(url, getWeather);
};

function getWeather(data) {
  // DECLARE VARS FOR JSON OBJECT PROPERTIES BEING USED AFTER CALLING IT
  var temp = data.main.temp;
  var tempUnit = units === "metric" ? "C" : "F";
  var windUnit = units === "metric" ? " meters/sec" : " miles/hour";
  var description = data.weather[0].description;
  var code = data.weather[0].icon;
  var wspeed = data.wind.speed;
  var city = data.name;

  //CREATE MARKUP TO ADD INTO HTML FILE AFTER WEATHER INFO CALL
  var html = '<img src="http://openweathermap.org/img/w/' + code +
    '.png" alt="Weather Icon" class="icon">' + '<p> ' + Math.round(temp) + ' ' + tempUnit +
    ', ' + description + '<br> Wind Speed: ' + wspeed + windUnit + '</p><p>' +
    city + '</p>';

  //UPDATE HTML FOR ADDED WEATHER INFORMATION
  $("#weather").html(html);
  var tempArr = tempsBackground(tempUnit);
  setBackground(temp, tempArr);

};

function Unit() {
  // CHECK FOR UNIT TYPE AND CALL OPEANWEATHERMAP API
  $("#f").is(":checked") ? units = "imperial" : units = "metric";
  callWeatherAPI();
};

//JQUERY HANDLER FOR CHANGING TEMPERATURE UNITS WITH RADIO BUTTON CHANGE
$("input[type=radio][name=farenheit-celcius]").change(Unit);
$(document).ready(getLocation);

function tempsBackground(tempUnit) {
  // TEMPERATURE RANGE FOR DYNAMIC BACKGROUND CHANGE
  var tempArr;
  switch (tempUnit) {
    case "F":
      tempArr = [90, 70, 32];
      break;
    case "C":
      tempArr = [32, 21, 0];
      break;
  }
  return tempArr;
};
function setBackground(temp, tempArr) {
  //CHANGE CSS BACKGROUND IMG ACCORDING TO TEMPRANGE
  if (temp >= tempArr[0]) {								//HOT
    $("body").css("background-image", imgs[0]);			
  } else if (temp < tempArr[0] && temp >= tempArr[1]) {	//WARM/CLEAR
    $("body").css("background-image", imgs[1]);			
  } else if (temp < tempArr[1] && temp >= tempArr[2]) {	//COLD
    $("body").css("background-image", imgs[2]);
  } else if (temp < tempArr[2]) {						//FREEZING
    $("body").css("background-image", imgs[3]);
  }
};

function start() {
  //STARTING FUNCTION FOR ACTUAL LOCAL WEATHER WEB APP
  getLocation();
  callWeatherAPI();
};


