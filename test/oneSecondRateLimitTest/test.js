/**
 * Script: Rate Limit Testing
 * --------------------------
 * This script sends a POST request to a specified API endpoint every 300 ms to test the rate-limiting functionality.
 */



const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_id": "USER2"
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

} , 300);

