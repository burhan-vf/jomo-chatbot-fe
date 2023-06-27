import { useState } from "react";
import "./App.css";
// import { TypeAnimation } from "react-type-animation";
import { Button } from "antd";
import logo from "./logo.svg";

function App() {
  const [response, setResponse] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (inputText !== "") {
      setLoading(true);
      e.preventDefault();
      try {
        let res = await fetch(
          `${process.env.REACT_APP_BASEURL}/jomo-recommendations`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: inputText }),
          }
        );

        let finalResponse = await res.json();
        if (finalResponse.response) {
          const arr = finalResponse.response;
          finalResponse = arr.join("|");
        } else {
          finalResponse = "";
        }
        let res1 = await fetch(
          `https://www.searchanise.com/getresults?api_key=1Z0i4h4Y6U&sortOrder=asc&restrictBy[product_id]=${finalResponse}&items=true&pages=false&categories=false&suggestions=false&facets=false&facetsShowUnavailableOptions=false&queryCorrection=true&output=json`,
          {
            method: "get",
            withCredentials: false,
          }
        );
        finalResponse = await res1.json();
        setResponse(finalResponse.items);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="App">
      <div className="text-center">
        <img src={logo} alt={"logo"} width={200} />
      </div>
      {/* <h3
        className="text-center"
        style={{ fontSize: "48px", marginTop: "50px" }}
      >
        Shopping Assistant{" "}
      </h3> */}
      <div style={{ margin: "20px 0"}}>
        Welcome to Jomo! How may I assist you in finding the perfect items
        today?
      </div>
      <form style={{}}>
        <textarea
          type="text"
          name="name"
          class="question"
          width={100}
          height={400}
          id="nme"
          required
          autocomplete="off"
          value={inputText}
          onChange={handleChange}
        />
        <div
          style={{
            textAlign: "center",
            width: "100%"
          }}
        >

          <Button
            onClick={handleSubmit}
            loading={loading}
            type="primary"
            size="small"
            style={{
              height: "50%",
              textAlign: "center",
              margin: 10,
              backgroundColor: "#bdd631",
            }}
          >
            Submit
          </Button>
        </div>
      </form>

      {response &&
        response.map((item) => {
          return (
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
              <div style={{ marginRight: "50px"}}>
                <img src={item.image_link} alt={"Product"} width={200} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem" }}> {item.title}</h4>
                <p style={{ fontSize: "1rem" }}> {item.description} </p>
                <p style={{ fontSize: "1rem" }}>Rs. {Math.floor(item.price)} </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
