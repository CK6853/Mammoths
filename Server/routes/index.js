var express = require('express');
var router = express.Router();

// At index page, just display all data on the backend
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  DB = req.DB;
  res.json(DB.get("events"));
});

router.post("/", function(req, res, next) {
  console.log(req.body)
  res.status(200)
  res.send()
})

router.get("/testing", async function (req, res, next) {
  DB = req.DB;
  let events = await DB.get("events")
  console.log(events)
  if (events === undefined) events = []
  let newEvent = {
    name: "Caleb",
    email: "test@outlook.com",
    phone: "0412345678",
    date: "Will check format for this later"
  }
  events.push(newEvent)
  await DB.set("events", events)
  res.json("ok")
})

// API call to reset all data
router.get('/reset', async function(req, res, next) {
  // Nothing should go wrong, but if it does it will be handled by the default error handler
  // Clear data
  await DB.deleteAll();
  // Set an initial state
  DB.set("events", [])
  // Server log
  console.log("Reset DB");
  // Tell the user
  res.json("Reset");  
})

module.exports = router;
