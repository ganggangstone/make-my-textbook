// npx vivliostyle build  → book.pdf  (run `node build.mjs` first; set BOOK_LANG the same way for both)
const fs = require("node:fs");
const html = fs.readFileSync("dist/book.html", "utf8");
module.exports = {
  title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "Untitled book",
  language: process.env.BOOK_LANG || "ko",
  size: "176mm,250mm",
  entry: ["dist/book.html"],
  output: "book.pdf",
  timeout: 600000,
};
