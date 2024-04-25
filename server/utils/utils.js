const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const express = require("express");
//Déclaration app, http, socketIO
const app = express();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const MIGRATE = false;

const getDateTime = (name = "") => {
  const date = new Date();
  name += `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}_${date.getMilliseconds()}`;
  return name;
};

const getDateNow = (option = "datetime") => {
  const date = new Date(); //2022-10-22 17:41:30
  let dateString = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  if (option === "date") {
    dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
  } else if (option === "time") {
    dateString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  return dateString;
};
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const bcryptData = (data, salt = 10) => {
  let dataCrypted = bcrypt.hashSync(data, salt);
  console.log("\n\n", dataCrypted, "\n\n");
  return dataCrypted;
};

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
};
const uploadFile = (
  req,
  res,
  sigle,
  dir,
  itemData,
  callBack = null,
  lastImage = "",
  nameColImage = "image",
  allowType = [".png", ".jpeg", ".jpg"]
) => {
  console.log("\n\n\n\n\navec file\n\n\n\n");
  const file = req.files.file;
  const fileSize = req.files.lenght;
  const fileExt = path.extname(file.name);
  const fileName = getDateTime(sigle) + fileExt;
  const url = `${req.protocol}://${req.get("host")}/${dir}/${fileName}`;
  if (!allowType.includes(fileExt.toLowerCase())) {
    return res.status(422).send({ message: "Fichier invalide!" });
  }
  if (fileSize > 10000000) {
    return res
      .status(422)
      .send({ message: "Fichier trop lourd (Plus de 10 MB) !" });
  }

  itemData[nameColImage] = fileName;
  console.log(
    "\n\n itemData['nameColImage'] : ",
    itemData[nameColImage],
    "\n\n"
  );
  if (itemData["url"]) {
    itemData["url"] = url;
    console.log("\n\n itemData['url'] : ", itemData["url"], "\n\n");
  }
  file.mv(`./public/${dir}/${fileName}`, async (error) => {
    if (error) return res.status(500).send({ message: error.message });
    if (callBack) {
      callBack();
    } else {
      if (lastImage) {
        const filepath = `./public/${dir}/${lastImage}`;
        // Check if file exist
        fs.access(filepath, fs.F_OK, (err) => {
          console.log("fs.access : ");
          if (err) {
            console.error(err);
            return;
          }
          console.log("\n\n DELETED : ", fileName, "\n\n");
          fs.unlinkSync(filepath);
          //file exists
        });
      }
    }
  });
};

const formatZero = (number, length = 4) => {
  const zero = (j) => {
    let a = "";
    for (let i = 0; i < j; i++) {
      a += "0";
    }
    return a;
  };
  return number.toString().length >= length
    ? number
    : zero(length - number.toString().length) + number.toString();
};
const getId = async (Model, sigle = "") => {
  try {
    const response = await Model.findOne({
      order: [["createdAt", "DESC"]],
    });
    let new_id = sigle;
    console.log("\n\nresponse", response);
    if (response) {
      console.log("\n\nresponse", response.id);

      new_id += formatZero(
        parseInt(response.id.toString().slice(sigle.length)) + 1,
        4
      );
    } else {
      new_id += formatZero(1, 4);
    }
    console.log("\n\nnew_id", new_id, "\n\n");
    return new_id;
  } catch (error) {
    console.log(error.message);
  }
};

const getEmplacement = (strEmplacement) => {
  let arr = strEmplacement.slice(0, -6).split("--//--,");
  let finalArr = [];
  for (let i = 0; i < arr.length; i++) {
    const json = JSON.parse(arr[i]);
    finalArr.push(json);
  }
  return finalArr;
};

module.exports = {
  MIGRATE,
  getDateTime,
  getDateNow,
  capitalizeFirstLetter,
  bcryptData,
  numberWithCommas,
  uploadFile,
  formatZero,
  getId,
  getEmplacement,
  app,
  http,
  socketIO,
};
