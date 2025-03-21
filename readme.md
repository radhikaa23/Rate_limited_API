
# 🚀 My Node.js API

Welcome to **My Node.js API**! This project provides a simple and efficient API that you can run using Docker or manually with Node.js. Follow the instructions below to get the server up and running.

---

## 🌟 Features
- **Rate Limiting**: Ensures controlled task processing for users.
- **Task Queueing**: Manages tasks effectively in a Redis queue.
- **Fast & Lightweight**: Built with Node.js and Redis for performance.

---

## 📋 Prerequisites

Before you start, ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/) (for running with Docker)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for running manually)
- No process running on port 5000 

---

## 🚀 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/my-node-api.git
cd my-node-api
```

### 2. Install Dependencies

Make sure you're in the project root directory and run:
```bash
npm install
```

### 3. Update Redis Configuration (For Localhost)

If you're running Redis locally and not through Docker, go to the `utils/redis.js` file. Replace the Redis instance configuration:

```javascript
redisInstance = new Redis({
  host: 'localhost', // Change this from 'redis' to 'localhost'
  port: 6379,
});
```

This ensures that the API connects to your local Redis instance.

### 4. Start the Server

Run the following command to start the server:
```bash
node index.js
```

### 5. Access the API

The server will be running at:  
```
http://localhost:5000
```

---

## 🐳 Running with Docker

### 1. Ensure Port Availability

Make sure that port 5000 is not engaged by another service on your machine.

### 2. Run Docker Compose

In the project root directory, run:
```bash
docker-compose up
```
This will install all dependencies and start the Node.js server.

### 3. Access the API

The server will be running at:  
```
http://localhost:5000
```

---

## 🧪 Testing Rate Limiting

To test the rate-limiting functionality, use the following request template and send it multiple times:

```bash
POST http://localhost:5000/api/v1/task
Content-Type: application/json

{
  "user_id": "USER1"
}
```

You can use tools like [Postman](https://www.postman.com/) or `curl` to test your requests.

---

## 🧪 Running Test Scripts

In the `test` folder, I've provided scripts to test different rate-limiting scenarios. You can simulate various users and request rates to observe the behavior of the rate limiter.

### 1. Rate Limit Testing Scripts:

The `test` folder contains the following test scripts:

#### **1. `oneMinuteLimitTest`**:
This script sends a POST request every 1.5 seconds to simulate a user hitting the rate limit.

#### **2. `oneSecondRateLimitTest`**:
This script sends a POST request every 300 milliseconds to test a more aggressive rate limit scenario.

#### **3. `simulateMultipleUser`**:
This script simulates multiple users sending requests concurrently to test how the rate limiter handles different users.

Each script contains the following pattern:

```javascript
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_id": "USER1" // Change user ID as needed
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

setInterval(() => {
  fetch("http://localhost:5000/api/v1/task", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error));
}, 1500); // Adjust the interval based on the test scenario
```

You can run these scripts to see how the rate-limiting mechanism responds to different request rates and users.

---

## 📂 Folder Structure

```
/my-node-api
├── /test                 # Contains test scripts for rate limiting
│   ├── oneMinuteLimitTest # Script testing 1.5-second request intervals
│   ├── oneSecondRateLimitTest # Script testing 300ms request intervals
│   └── simulateMultipleUser  # Script simulating multiple users
├── /utils                # Contains utility files like redis.js
├── package.json          # Node.js dependencies
├── index.js              # Main application entry point
└── docker-compose.yml    # Docker configuration
```

### 📝 Logs

The `logs` folder contains a file named `task_log.txt` that logs all user activities. You can use this file to monitor user interactions with the API.

---

Happy coding! 🎉
