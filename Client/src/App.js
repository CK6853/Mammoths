import './App.css';
import { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1>Mammoths - A Deep Dive</h1>
      <EventForm />
    </div>
  );
}


function EventForm() {

  const [date, setDate] = useState("2025-05-24")
  const [submissionStatus, setSubmissionStatus] = useState("Incomplete")

  function submit(formData) {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        date: formData.get("date")
      })
    }
    setSubmissionStatus("Pending")
    fetch("http://phoenix.zapto.org:3002/", requestOptions)
      .then(res => {
        switch(res.status) {
          case 200:
            setSubmissionStatus("Complete")
            break;
          default:
            setSubmissionStatus("Error")
        }
      })
  }

  function submissionMessage() {
    switch (submissionStatus) {
      case "Incomplete":
        return;
      case "Pending":
        return "Sending registration request to server..."
      case "Complete":
        return "Registration succcessful"
      case "Error":
        return "Something went wrong. Please try again."
    }
  }

  return (
    <div className="eventForm">
      <form action={submit}>
        <table><tbody><tr>
            <td><label htmlFor="email">Email</label></td>
            <td><input name="email" id="email" type="email" placeholder="someone@example.com" autoComplete="email" required/>
            <span className="validity"></span></td>
          </tr><tr>
            <td><label htmlFor="name">Name</label></td>
            <td><input name="name" id="name" type="text" placeholder="John Smith" autoComplete="name" required/>
            <span className="validity"></span></td>
          </tr><tr>
            <td><label htmlFor="phone">Phone</label></td>
            <td><input name="phone" id="phone" type="tel" placeholder="0412345678" autoComplete="phone" pattern="^[0-9]{8,10}$" required/>
            <span className="validity"></span></td>
          </tr><tr>
            <td><label htmlFor="date">Date</label></td>
            <td><input name="date" id="date" type="date" value={date} onChange={event => setDate(event.target.value)} min="2025-05-24" max="2025-05-26" required/></td>
          </tr><tr>
            <td><button type="submit">Submit</button></td>
            <td>
              {submissionMessage()}
            </td>
          </tr></tbody></table>
      </form>
    </div>
  )
}

export default App;
