This web app was built to assess front-end web development skills 

## Prerequisites

### Node.JS

Information: https://github.com/nodejs/node

### npm 

Information: https://github.com/npm/cli 

## How to run

### Clone this repository

```
git clone https://github.com/j-cheung/neatmaps.git
```

### Setup Google Maps API keys

create a new file: `some/path/neatmaps/.env`
add the following, with your own Goole Maps API Key
```
GOOGLE_MAPS_API_KEY=[YOUR_API_KEY]
```

create another: `some/path/neatmaps/client/.env`
```
REACT_APP_GOOGLE_MAPS_API_KEY=[YOUR_API_KEY]
```

### Start Node.js (Express) Server

```
cd neatmaps
npm install
npm start
```
Express server will be listening on port 5000 by default

### Start React
With a new terminal window,

```
cd client
npm install
npm start
```

The app will be running on http://localhost:3000

#### Within the app
To authenticate users, https://neat-api-docs.herokuapp.com/#authentication is used.

### To Run Tests

```
cd some/path/neatmaps/client
npm test
```
