const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT||10000;

app.use(express.json());
app.get("/", async (req, res) => {
  const num = parseInt(req.query.num || 0) + 3;
  console.log(num);
  res.json({ num });
});

app.post("/check", async (req, res) => {
  try {
    const { url } = req.body;
    console.log("Checking:", url);
    const result = await axios.get(url);
    console.log(result.data);
    res.json(result.data);
  } catch (error) {
    console.log(error);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

app.post("/execute", async (req, res) => {
  try {
    const { method, url, headers, data } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Method and URL are required" });
    }

    const axiosConfig = {
      method: method || "GET",
      url,
      headers,
      data,
    };
    console.log("executing:", axiosConfig);

    const response = await axios(axiosConfig);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error?.response?.data || error.code);
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
