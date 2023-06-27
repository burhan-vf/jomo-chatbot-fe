import { useState } from "react";
import "./App.css";
import { TypeAnimation } from "react-type-animation";
import { Button } from "antd";

function App() {
  const [response, setResponse] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (inputText != "") {
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
        <label for="nme" style={{ fontSize: "24px" }}>
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
          <Button
            onClick={handleSubmit}
            loading={loading}
            type="primary"
            size="small"
            style={{
              height: "50%",
              textAlign: "center",
              margin: 10,
            }}
          >
            <span>Submit</span>
          </Button>
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
                <TypeAnimation
                  key={item.title}
                  sequence={[item.title]}
                  wrapper="h4"
                  cursor={false}
                  repeat={0}
                  style={{ fontSize: "1rem" }}
                />
                <TypeAnimation
                  key={item.title}
                  sequence={[item.description]}
                  wrapper="p"
                  cursor={false}
                  repeat={0}
                  style={{ fontSize: "1rem" }}
                />
                {/* <h5>{item.title}</h5>
                <p>{item.description}</p> */}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
