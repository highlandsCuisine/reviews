const schedule = require("node-schedule");
const { getRestaurantData } = require("../controller/restaurant.controller");
const authService = require("../services/auth.service");

const fetchData = async (data) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}api/v1/reviews/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Data fetched successfully:");
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};
//job1 fetches the restaurants reviews data every day from google at mid-night
// 0 0 * * *
const job1 = schedule.scheduleJob("0 0 * * *", async () => {
  const data = await getRestaurantData();
  data.map((d) => {
    console.log(`Fetching data for ${d.name}`);
    fetchData({ rid: d.rid, name: d.name, link: d.link });
  });
});
//job2 deletes expired tokens in every 1 minute of interval
const job2 = schedule.scheduleJob("*/1 * * * *", async () => {
  authService
    .deleteExpiredTokens()
    .then((data) => {
      console.log("Deleted expired tokens successfully!");
    })
    .catch((e) => {
      console.log("Deleting expired tokens failed with message:", e);
    });
});

//job3 deletes expired user verify tokens in every 10 minute of interval
const job3 = schedule.scheduleJob("*/10 * * * *", async () => {
  authService
    .deleteExpiredVerify()
    .then((data) => {
      console.log("Deleted expired user tokens successfully!");
    })
    .catch((e) => {
      console.log("Deleting expired user tokens failed with message:", e);
    });
});

module.exports = { job1: job1, job2: job2, job3: job3 };
