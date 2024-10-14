import './App.css';
import { useState } from "react";

const serverURL = "http://phoenix.zapto.org:3002/"

// App body - just a heading and a custom component for the form
function App() {
  return (
    <div className="App">
      <h3>Mammoths - A Deep Dive</h3>
      <EventForm />
    </div>
  );
}

// Event form - no props
// Holds all the inputs, state and API calls needed to register for an event
function EventForm() {

  // Set up state for date input - others can handle their own
  const [date, setDate] = useState("2025-05-24")
  // Track current state of submission for display
  // I would normally use an enum for this, but JS doesn't support those so a specified string will do
  const [submissionStatus, setSubmissionStatus] = useState("Incomplete")
  // Also track if the user has entered an invalid submission before
  const [hasInvalidSubmission, setHasInvalidSubmission] = useState(false)

  // Function to call on submission of form
  // In normal use, will only be called if form data is valid
  // Server has its own validation just in case
  function submit(formData) {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      // Get data from inputs
      body: JSON.stringify({
        email: formData.get("email"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        date: formData.get("date")
      })
    }
    // Once we're sending the submission, set status to "Pending" until we get a response
    setSubmissionStatus("Pending")
    fetch(serverURL, requestOptions)
      .then(res => {
        switch(res.status) {
          // In case of an "ok" response, set status to "complete"
          case 200:
            setSubmissionStatus("Complete")
            break;
          // Any other response - something has gone wrong (e.g. validation failure, server outage)
          default:
            setSubmissionStatus("Error")
        }
      })
  }

  // Display a message based on status state
  function submissionMessage() {
    switch (submissionStatus) {
      case "Incomplete":
        return;
      case "Pending":
        return "Sending registration request to server..."
      case "Complete":
        return "Registration successful"
      case "Error":
        return "Something went wrong. Please try again."
      default: return
    }
  }

  // Set a custom error message for invalid data - designed to be called by input object's onInvalid event
  // Currently only implemented for "phone" input - but easily expandable (I think the default validation errors for other types are adequate)
  // Could also be replaced entirely by a custom validation system, but too much effort for an example
  function onInvalidSubmission(event) {
    switch (event.target.id) {
      case "phone":
        event.target.setCustomValidity("Please enter an 8 to 10 digit number with no non-numeric characters or spaces")
        break;
      default: 
        setHasInvalidSubmission(true)
        return
    }
  }

  // Once setCustomValidity is called (above), it needs to be reset in order to allow re-submission
  // Designed to be called by input object's onInput event
  // However, resetting prematurely will return to the default error message rather than the custom one set above
  // So, only reset the custom validity message once the data is valid again
  // Currently only implemented for "phone" input - but easily expandable
  function checkValidity(event) {
    switch (event.target.id) {
      case "phone":
        if (event.target.value.match(/^[0-9]{8,10}$/) !== null) {
          event.target.setCustomValidity("")
        }
        break;
      default: return
    }
  }

  return (
    <div className="eventForm">
      <form action={submit}>
        {/*Use a table to align everything nicely*/}
        {/*Make a row for each input's label, input, and validation span*/}
        <table><tbody><tr>
            <td><label htmlFor="email">Email</label></td>
            <td><input name="email" id="email" autoComplete="email" 
              // Use "type" to use default client-side validation
              type="email"
              // Show correct format as placeholder
              placeholder="someone@example.com" 
              // If attempting to submit invalid data, update state
              onInvalid={event=>onInvalidSubmission(event)} 
              // Set "required" to disallow submitting without entering data           
              required
            />
            {/*Create a span after the input box to use with CSS pseudo-elements for validation - only show if the user has entered invalid data before*/}
            {hasInvalidSubmission ? <span className="validity"></span> : ""}</td>
          </tr><tr>
            <td><label htmlFor="name">Name</label></td>
            <td><input name="name" id="name" autoComplete="name" type="text" placeholder="John Smith" onInvalid={event=>onInvalidSubmission(event)} required/>
            {hasInvalidSubmission ? <span className="validity"></span> : ""}</td>
          </tr><tr>
            <td><label htmlFor="phone">Phone</label></td>
            <td><input name="phone" id="phone" autoComplete="phone" type="tel" placeholder="0412345678" required
              // Use Regex pattern to restrict entries to valid phone numbers (adjust if other formats are needed)
              pattern="^[0-9]{8,10}$" 
              // Use custom validity error messages (see functions above)
              onInvalid={event=>onInvalidSubmission(event)} 
              onInput={event=>checkValidity(event)} 
            />
            {hasInvalidSubmission ? <span className="validity"></span> : ""}</td>
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
