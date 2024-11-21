# Casa Bonita Reservation Bot
## About
Created a bot that will check for reservation availbility for Casa Bonita. This bot will check for reservations given the target timeframe and party size then email an alert via email (https://healthchecks.io/).

After booking a flight to Denver, I was researching on things to do while I was there. Being a big South Park fan, I had to goto Casa Bonita. However, reservations were hard to come by given its popularity. This is when I spend a few hours and scambled to get this bot up and running to increase my odds of landing a reservation.

## Getting Started
1. Setup a [healthchecks.io](https://healthchecks.io/) account and generate a unique ping URL.
    1. This URL will be connected to your email and ping you when a reservation is found 
2. Clone repo
```
git clone nnnnnnnnn
```
3. Install NPM packages
```
npm install
```
4. Open bot.ts in a code editor and updated the constants specified at the top of the file
```
const CRON_SCHEDULE = "*/5 * * * *"; // Every 5 minutes
const START_DATE = "2024-10-17"; // YYYY-MM-DD
const NUM_DAYS = 5; // Number of days to check from START_DATE
const PARTY_SIZES = [2, 4]; // Party sizes to check
const HEALTHCHECKS_IO_URL = ``; // Health check IO is used as a way to get free email alerts
```
5. Execute bot
```
npm run bot
```
 