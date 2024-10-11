var express = require('express');
var router = express.Router();

// At index page, just display all data on the backend
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  DB = req.DB;
  res.json(DB.get("events"));
});

router.post("/", async function(req, res, next) {
  // VALIDATION
  
  // Save new event to DB
  DB = req.DB;
  let events = await DB.get("events")
  if (events === undefined) events = []
  events.push(req.body)
  await DB.set("events", events)

  // Let the client know the event was registered successfully
  res.status(200)
  res.send()
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
