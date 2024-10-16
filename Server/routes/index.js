var express = require('express');
var router = express.Router();

// If someone requests the index page, just display all data
router.get('/', async function(req, res, next) {
  let events = await req.DB.get("events")
  res.render('index', { events: events });
});

// When the client sends a "post" request
router.post("/", async function(req, res, next) {
  // Validation
  // Email must match standard format (apparently this Regex is equivalent to the default HTML email input pattern)
  let validEmail = ("email" in req.body && req.body.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) !== null)
  // Name must exist
  let validName = ("name" in req.body)
  // Phone number must be an 8 to 10 digit number
  let validPhone = ("phone" in req.body && req.body.phone.match(/^[0-9]{8,10}$/) !== null)
  let validDate
  switch (req.body.date) {
    // If any of the valid dates, valid
    case "2025-05-24":
    case "2025-05-25":
    case "2025-05-26":
      validDate = true
      break
    default:
      // Anything else, not
      validDate = false
  }
  
  // If any of the fields are invalid, return "bad request"
  if (!validEmail || !validName || !validPhone || !validDate) {
    res.status(400)
    res.send()
    return
  }
  
  // Validation passed
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

// API route to reset all data
router.get('/reset', async function(req, res, next) {
  // Nothing should go wrong, but if it does it will be handled by the default error handler
  // Clear data
  req.DB.deleteAll();
  // Set an initial state
  req.DB.set("events", [])
  // Server log
  console.log("Reset DB");
  // Tell the user
  res.json("Reset successful");  
})

module.exports = router;
