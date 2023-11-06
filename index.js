let wheather ={
    apiKey : "a33001df1c319dd29dbb5895c1b60cfe",
    getdatalonlat : function (){
        fetch(
            "http://api.openweathermap.org/geo/1.0/direct?q=kottayam&limit=5&appid=a33001df1c319dd29dbb5895c1b60cfe"
        )
        .then((response) => response.json())
        .then((data) => this.getLanLon(data))
    },
    getLanLon: function (data){
        const {lat} = data[0];
        const {lon} = data[0];
        this.getWeather(lat,lon);
    },
    getWeather : function (lat,lon){
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&exclude=&units=metric&appid=a33001df1c319dd29dbb5895c1b60cfe")
        .then((response) => response.json())
        .then((data) => this.wheather_2(data))
    }
    ,
    wheather_2 : function (data){
        console.log(data);
        const {humidity,feels_like} = data.main;
        const {name} = data;
        const {main} = data.weather[0];
        const {speed} = data.wind;
        console.log(humidity,feels_like,main,name,speed);
        document.querySelector(".text-1").innerHTML = name;
        document.querySelector(".hum-per").innerHTML = humidity + "%";
        document.querySelector(".celsius").innerHTML = feels_like;
        document.querySelector(".wind-value").innerHTML = speed+ " km/h";
    }
}

document.querySelector(".search-bar a").addEventListener("click",function(){
    search: function l() {
        document.querySelector(".search").value
    }
})