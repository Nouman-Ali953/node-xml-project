const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.myFile;
  const newPath = __dirname + "/uploads/" + file.name;

  file.mv(newPath, (err) => {
    if (err) {
      console.error(err);
    }
  });

  //   console.log(req.files.myFile.name);

  if (req.files) {
    try {
      await fs.readFile(
        `./uploads/${req.files.myFile.name}`,
        "utf-8",
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var splitData = data
              .replace(/\r/g, "")
              .replace(/\n/g, "")
              .split(" ")
              .filter(Boolean);
            var xml =
              '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>';
            for (var i = 0; i < splitData.length; i++) {
              xml += `<item${i}>${splitData[i]}</item${i}>`;
            }
            xml += "</root>";

            console.log(xml);

            fs.writeFile("new1.xml", xml, (err, datas) => {});
          }
        }
      );
    } catch (ex) {
      // Show error
      console.log(ex);

      // Send response
      res.status(500).send({
        ok: false,
        error: "Something went wrong on the server",
      });
    }

    // Send response
    res.status(200).download(__dirname + "/new1.xml");
  }
});

app.post("/textConvert", async (req, res) => {
  try {
    // read data from a text input
    console.log(req.body.toConvert);
    data = req.body.toConvert;

    var splitData = data
      .replace(/\r/g, "")
      .replace(/\n/g, "")
      .split(" ")
      .filter(Boolean);
    var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<root>';
    for (var i = 0; i < splitData.length; i++) {
      xml += `<item>${splitData[i]}</item>`;
    }
    xml += "</root>";

    console.log(xml);

    await fs.writeFile("new1.xml", xml, (err) => {});
  } catch (ex) {
    // Show error
    console.log(ex);
  }

  res.status(200).download(__dirname + "/new1.xml");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
