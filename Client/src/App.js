import './App.css';

function App() {

  function search(formData) {
    const requestOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({text: formData.get("test")})
    }
    fetch("http://phoenix.zapto.org:3002/", requestOptions)
      .then(res => console.log(res.status))
  }

  return (
    <div className="App">
      <h1>Mammoths - A Deep Dive</h1>
      <form action={search}>
        <input name="test" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
