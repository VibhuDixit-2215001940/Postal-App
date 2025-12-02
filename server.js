import express from "express";
import axios from "axios";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

app.post("/search", async (req, res) => {
  const { searchType, queryValue } = req.body;

  if (!queryValue) {
    return res.render("index", { result: null, error: "Please enter a value." });
  }

  try {
    const url =
      searchType === "pincode"
        ? `https://api.postalpincode.in/pincode/${queryValue}`
        : `https://api.postalpincode.in/postoffice/${queryValue}`;

    const response = await axios.get(url);
    const data = response.data[0];

    if (data.Status === "Success") {
      res.render("index", { result: data, error: null });
    } else {
      res.render("index", { result: null, error: "No records found." });
    }
  } catch (err) {
    res.render("index", { result: null, error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
