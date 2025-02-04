const path = require("path");
const fs = require("node:fs");

const actualPath = "/home/varun/Personal-data/FULL STACK DEVLOPMENT/RESUME-PROJECTS/TalksGram/BACKEND/public/default.jpg";

  const imagePath = path.resolve(actualPath);
  const imageBuffer = fs.readFileSync(imagePath);

 const stringImage = String(imageBuffer);

  console.log(stringImage);