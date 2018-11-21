This web app was built to assess front-end web development skills 

## How to run

### Clone this repository

```
git clone https://github.com/j-cheung/neatmaps.git
```

### Setup Google Maps API keys

create a new file: /neatmaps/.env
add the following, with your own Goole Maps API Key
```
GOOGLE_MAPS_API_KEY=[YOUR_API_KEY]
```

create another: /neatmaps/client/.env
```
REACT_APP_GOOGLE_MAPS_API_KEY=[YOUR_API_KEY]
```

### Start Node.js (Express) Server

```
cd [path]/neatmaps
npm start
```
Express server will be listening on port 5000 by default

### Start React

```
cd [path]/neatmaps/client
npm start
```

The app will be running on http://localhost:3000

### To Run Tests

```
cd [path]/neatmaps/client
npm test
```
