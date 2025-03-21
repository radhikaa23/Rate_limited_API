

/**
 * Script: Rate Limit Testing
 * --------------------------
 * This script sends a POST request to a specified API endpoint every 1.5 seconds to test the rate-limiting functionality.
 * For User3
 * Run both script in this folder to simulate multiple users
 */




const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_id": "USER3"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};


setInterval(()=>{

    fetch("http://localhost:5000/api/v1/task", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

} , 1500);

