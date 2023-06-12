import { useState } from "react";
import "./App.css";

function App() {
  const [response, setResponse] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await fetch(`${process.env.REACT_APP_BASEURL}/chatbot`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputText }),
    });

    let finalResponse = await res.json();
    const arr = finalResponse.message.text
      .split(",")
      .map((item) => item.trim());

    console.log(arr, finalResponse.message.text);

    finalResponse = arr.join("|");

    let res1 = await fetch(
      `https://www.searchanise.com/getresults?api_key=0W3e6T0n6W&sortOrder=asc&restrictBy[product_id]=${finalResponse}&items=true&pages=false&categories=false&suggestions=false&facets=false&facetsShowUnavailableOptions=false&queryCorrection=true&output=json`,
      {
        method: "get",
        withCredentials: false,
      }
    );
    finalResponse = await res1.json();
    setResponse(finalResponse.items);
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="App">
      <h3
        className="text-center"
        style={{ fontSize: "48px", marginTop: "50px" }}
      >
        Shopping Assistant{" "}
      </h3>
      <form style={{ marginTop: "80px" }}>
        <textarea
          type="text"
          name="name"
          class="question"
          id="nme"
          required
          autocomplete="off"
          value={inputText}
          onChange={handleChange}
        />
        <label for="nme" style={{ fontSize: "28px" }}>
          <span>
            Welcome to Jomo! How may I assist you in finding the perfect items
            today?
          </span>
        </label>
        <div
          style={{
            display: "flex",
            width: "80%",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <button onClick={handleSubmit} className="button">
            Submit
          </button>
        </div>
      </form>

      {response &&
        response.map((item) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "30%" }}>
                <img src={item.image_link} width={200} />
              </div>
              <div style={{ width: "70%" }}>
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
