let wheather ={
    apiKey : "a33001df1c319dd29dbb5895c1b60cfe",
    getdatalonlat : function (city){
        fetch(
            "//api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid=a33001df1c319dd29dbb5895c1b60cfe"
        )
        .then((response) => response.json())
        .then((data) => this.getLanLon(data))
    },
    getLanLon: function (data){
        const {lat} = data[0];
        const {lon} = data[0];
        this.getWeather(lat,lon);
        this.getsunrisesunset(lat,lon);
        this.getPlaceName(lat,lon);
    },
    getWeather : function (lat,lon){
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&exclude=&units=metric&appid=a33001df1c319dd29dbb5895c1b60cfe")
        .then((response) => response.json())
        .then((data) => this.wheather_2(data))
    },
    wheather_2 : function (data){
        const {humidity,feels_like} = data.main;
        const {name} = data;
        const {main} = data.weather[0];
        const {speed} = data.wind;
        document.querySelector(".hum-per").innerHTML = humidity + "%";
        document.querySelector(".celsius").innerHTML = feels_like + '\u00B0';
        document.querySelector(".wind-value").innerHTML = speed+ " km/h";
    },
    search: function () {
        this.getdatalonlat(document.querySelector(".search").value);
    },
    getsunrisesunset : function(lat,lon){
        fetch("https://api.sunrisesunset.io/json?lat="+lat+"&lng="+lon+"&timezone=IST")
        .then((response) => response.json())
        .then((data) => this.setsunsrisesunset(data))
    },
    setsunsrisesunset: function(data){
        const {sunrise} = data.results;
        const {sunset} = data.results;
        document.querySelector(".time-2").innerHTML = sunset.slice(0,4)+ " pm";
        document.querySelector(".time-3").innerHTML = sunrise.slice(0,4) + " am";
        
    },
    getPlaceName: function (lat,lon){
        fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=0d47df981dc843aaa30cd5fe7adc7f71")
        .then((response) => response.json())
        .then((data) => this.placeName(data))
    },
    placeName: function(data){
        const {country} = data.features[0].properties;
        const {city} = data.features[0].properties;
        document.querySelector(".text-1").innerHTML = city+','+country;
    }

}
document.querySelector(".search-button").addEventListener("click",function(){
    wheather.search();
})
document.querySelector(".search").addEventListener("keyup", function (event){
    if (event.key == "Enter"){
        wheather.search();
    }
})
let d = new Date();
        let dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let day = dayNames[d.getDay()];
         let hour = d.getHours();
        let min = d.getMinutes();
        let ampm = hour >= 12?"pm":"am";
        document.querySelector(".day").innerHTML = day;
        document.querySelector(".time").innerHTML = hour + ":" + min +" "+ ampm;
        if (ampm === "am" && hour >6){
            let img = document.querySelector(".weather-image");
            img.src = "sun-512.png";
            img.classList.add("weather-image-day");
        }
        

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        nowgetNowplace(lat,lon);
        getChangeDeg(lat,lon);
        });
        } else {
            console.log("Geolocation is not supported by this browser.");
            }
       
        
function getChangeDeg(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&exclude=&units=metric&appid=a33001df1c319dd29dbb5895c1b60cfe")
    .then((response) => response.json())
    .then((data) => this.changeDeg(data))
}
function changeDeg(data){
        const {humidity,feels_like} = data.main;
        const {name} = data;
        const {main} = data.weather[0];
        const {speed} = data.wind;
        document.querySelector(".hum-per").innerHTML = humidity + "%";
        document.querySelector(".celsius").innerHTML = feels_like + '\u00B0';
        document.querySelector(".wind-value").innerHTML = speed+ " km/h";
}
function nowgetNowplace(lat,lon){
    fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=0d47df981dc843aaa30cd5fe7adc7f71")
    .then((response) => response.json())
    .then((data) => this.nowPlaceName(data))
}
function nowPlaceName(data){
    const {country} = data.features[0].properties;
    const {city} = data.features[0].properties;
    document.querySelector(".text-1").innerHTML = city+','+country;
}
getplacenonce()
