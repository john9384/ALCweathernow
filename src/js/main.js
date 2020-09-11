// URL https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&
// exclude={part}&appid={YOUR API KEY}

// API Key 06e223945d020ca490f451d0c5473080

document.addEventListener("DOMContentLoaded", () => {
  const search_form = document.querySelector(".search");
  const search_input = document.querySelector(".search__input");

  // Set the search to "" on load
  search_input.value = "";
  //  Get user location
  if (window.navigator.geolocation) {
    const geo_loc = window.navigator.geolocation;
    geo_loc.getCurrentPosition(get_loc_success, get_loc_faliure);
  } else {
    alert("Geo location not available on this device");
  }

  // Form submit Event
  search_form.addEventListener("submit", e => {
    e.preventDefault();
    const search_input = document.querySelector(".search__input");
    if (search_input.value == null || search_input.value == "") {
      alert("Input Field cannot be empty");
    } else {
      const date = new Date();
      const time = date.getTime();
      const key = `${search_input.value}_${time}`;
      localStorage.setItem(key, search_input.value);
      search_city(search_input.value);
    }
  });
});

function get_loc_success(position) {
  const user_lat = position.coords.latitude;
  const user_lon = position.coords.longitude;
  get_user_loc(user_lat, user_lon);
}
function get_loc_faliure(err) {
  loading_div("Allow location access to view you current weather details");
}
function day_of_week(num) {
  switch (num) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
    default:
      return null;
  }
}
function edited_date() {
  let date = new Date();
  let day = day_of_week(date.getDay());
  let hrs = date.getHours();
  let mins = date.getMinutes();
  return `${day} ${hrs}:${mins}`;
}
function create_content_head(obj) {
  const content_head = document.querySelector(".content__head");
  const weather_img = select_img(obj.desc);
  content_head.innerHTML = `
 <div class="bg-img">
            <img class="bg-img__content" src="${weather_img}"/>
          </div>
          <div class="card-large">
            <div class="card-large__loc">
              <h2 class="card-large__loc--name">${obj.name}</h2>
              <span class="card-large__loc--date">${obj.date}</span>
              <span class="card-large__loc--desc">${obj.desc}</span>
            </div>
            <div class="card-large__temp">
              <span
                >${obj.temp}<sup class="card-large__temp--sup"
                  >0 | C</sup
                ></span
              >
            </div>
            <div class="card-large__measures">
              <span class="card-large__measures--humi">Humidity: ${obj.humidity}</span>
              <span class="card-large__measures--press">Pressure: ${obj.pressure}</span>
               <span class="card-large__measures--wind">Wind Speed: ${obj.wind}</span>
            </div>
          </div>
              `;
}
function search_city(city) {
  loading_div("Fetching weather Data");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=06e223945d020ca490f451d0c5473080`
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error();
      }
    })
    .then(data => {
      const card_obj = {
        name: data.name,
        date: edited_date(),
        desc: data.weather[0].description,
        icon: data.weather[0].icon,
        temp: kelvin_to_celcius(data.main.temp),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: data.wind.speed
      };
      create_content_head(card_obj);
    })
    .catch(err => {
      console.log(err);
    });
}
function get_user_loc(user_lat, user_lon) {
  loading_div("Fetching weather Data");
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${user_lat}&lon=${user_lon}&appid=06e223945d020ca490f451d0c5473080`
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error();
      }
    })
    .then(data => {
      const card_obj = {
        name: data.timezone,
        date: edited_date(),
        desc: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        temp: kelvin_to_celcius(data.current.temp),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        wind: data.current.wind_speed
      };
      create_content_head(card_obj);
    })
    .catch(err => {
      console.log(err);
    });
}

function kelvin_to_celcius(temp) {
  const temp_cel = temp - 273.15;
  return temp_cel.toFixed(1);
}

function loading_div(head_text) {
  const content_head = document.querySelector(".content__head");
  content_head.innerHTML = `
      <div class="loading">
            <h2 class="loading__head">${head_text}</h2>
            <div class="loading__icon">
              <span class="loading__icon--1">&nbsp;</span
              ><span class="loading__icon--2">&nbsp;</span
              ><span class="loading__icon--3">&nbsp;</span>
            </div>
          </div>
      `;
}

function select_img(desc) {
  if (desc.includes("rain")) {
    return "assets/img/valentin-muller-bWtd1ZyEy6w-unsplash.jpg";
  }
  if (desc.includes("sun")) {
    return "assets/img/david-jusko-X_CBtIMUfDc-unsplash.jpg";
  }
  if (desc.includes("cloud")) {
    return "assets/img/mosi-knife--PVgDgKXgZA-unsplash.jpg";
  }
  if (desc.includes("snow")) {
    return "assets/img/0d6274835787bd14a30441bd8c11f526.jpg";
  }
  if (desc.includes("thunder")) {
    return "assets/img/noaa-p9BRX1mBfe4-unsplashthunder storm.jpg";
  } else {
    return "assets/img/cate-bligh-lX5wMeZUidA-unsplash.jpg";
  }
}
