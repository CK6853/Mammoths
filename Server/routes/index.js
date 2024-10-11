var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

  DB = req.DB;
  res.json(DB.get("events"));
});

router.get("/testing", async function (req, res, next) {
  DB = req.DB;
  let events = await DB.get("events")
  console.log(events)
  if (events === undefined) events = []
  events.push("New event")
  await DB.set("events", events)
  res.json("ok")
})

// API call to reset all data
app.get('/reset', async function(req, res, next) {
  await DB.deleteAll();
  DB.set("events", [])
  console.log("Reset DB");
  res.json("Reset");
})

module.exports = router;
