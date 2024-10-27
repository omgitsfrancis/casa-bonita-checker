import cron from "node-cron";

// Adjust these values to your liking
const CRON_SCHEDULE = "*/5 * * * *"; // Every 5 minutes
const START_DATE = "2024-10-17"; // YYYY-MM-DD
const NUM_DAYS = 5; // Number of days to check from START_DATE
const PARTY_SIZES = [2, 4]; // Party sizes to check
const HEALTHCHECKS_IO_URL = ``; // Health check IO is used as a way to get free email alerts

// Fetches availability data from the SevenRooms API and analyzes it
async function getAvailability(startDate, numDays, partySize) {
  const query = `https://www.sevenrooms.com/api-yoa/availability/widget/range?venue=casabonitadenver&time_slot=7:00 PM&party_size=${partySize}&halo_size_interval=100&start_date=${startDate}&num_days=${numDays}&channel=SEVENROOMS_WIDGET&selected_lang_code=en`;
  const response = await fetch(query);
  const data = await response.json();

  if (data.status !== 200) {
    console.error("Error fetching data");
    return;
  }

  const availability = data["data"]["availability"];
  let allRequestableTimes = [];

  // Loop through each day and find requestable times
  for (const day of Object.keys(availability)) {
    const dayData = availability[day][0];
    const timeSlots = dayData?.times;

    if (timeSlots) {
      const requestableTimes = timeSlots
        .filter((slot) => slot["is_requestable"] !== false)
        .map((slot) => ({ day: day, time: slot["time"] }));

      if (requestableTimes.length > 0) {
        allRequestableTimes = [...allRequestableTimes, ...requestableTimes];
      }
    }
  }

  return allRequestableTimes;
}

// Sends a "failure" ping to Healthchecks.io
// Using this to get notifications when a reservation is available
async function sendPingNotification(healthchecksUrl: string) {
  await fetch(`${healthchecksUrl}/fail`); // Send a failure ping which sends an email notification
}

// Healthchecks.io success ping to reset the notification
async function resetPingNotification(healthchecksUrl: string) {
  await fetch(`${healthchecksUrl}`); // Send a failure ping which sends an email notification
}

// Main function to check availability for a given party size
async function check(partySize) {
  const currentDatetime = new Date(Date.now()).toLocaleString();

  console.log(
    "Fetching data (party size: " + partySize + ")... " + currentDatetime
  );
  const availbleTimeslots = await getAvailability(
    START_DATE,
    NUM_DAYS,
    partySize
  );

  if (availbleTimeslots.length === 0) {
    // Will reset to allow for another email notification
    if(HEALTHCHECKS_IO_URL) {
      await resetPingNotification(HEALTHCHECKS_IO_URL);
    }
    console.log("No availability found");
    return;
  }

  // Notify by email when a reservation is available
  if(HEALTHCHECKS_IO_URL){
    await sendPingNotification(HEALTHCHECKS_IO_URL);
  }

  console.log(
    "✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯"
  );
  console.log("BOOK NOW! https://reservations.casabonitadenver.com/");
  console.log("TIMES ARE AVAILABLE:");
  for (const timeslots of availbleTimeslots) {
    console.log(timeslots);
  }
  console.log(
    "✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯✯¸.•´*¨`*•✿ ✿•*`¨*`•.¸✯"
  );
}

async function main() {
  for (const partySize of PARTY_SIZES) {
    await check(partySize);
  }
}

main(); // Initial check when the script is run

cron.schedule(CRON_SCHEDULE, async () => {
  main();
});
