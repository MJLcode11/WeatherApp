const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const icon = wrapper.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");

let api;

const apiKey = config.API_KEY

inputField.addEventListener("keyup", e => {
    //if user hits enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestAPI(inputField.value)
    }
});

locationBtn.addEventListener("click", () => {
    if(navigator.geolocation){  ////if browser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation")
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords; //get lat and lon of uder device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestAPI(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details....."
    infoTxt.classList.add("pending");
    //get api response and return it as js object
    //then call weatherDetails function passing api result as argument.
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        //get required properties value from info object
        const city = info.name
        const country = info.sys.country
        const {description, id} = info.weather[0]
        const {feels_like, humidity, temp} = info.main

        //get specific icons according to api id
        if(id==800){
            icon.src = "icons/clear.svg"
        } else if (id >= 801 && id <= 804){
            icon.src = "icons/cloud.svg"
        } else if (id >= 200 && id <= 232){
            icon.src = "icons/storm.svg"
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            icon.src = "icons/storm.svg"
        } else if (id >= 600 && id <= 622){
            icon.src = "icons/snow.svg"
        } else if (id >= 701 && id <= 781){
            icon.src = "icons/haze.svg"  
        }

        //pass values to particular html element 
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        console.log(info); 
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
})
