const http = require("http");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "books.json");

const server = http.createServer((req, res) => {
  const pathname = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");

  if (method === "GET" && pathname === "/books") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ message: "Error reading file" }));
      }

      res.writeHead(200);
      res.end(data);
    });
  } else if (method === "POST" && pathname === "/books") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      let reqBody;

      try {
        reqBody = JSON.parse(body);
      } catch (error) {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: "Invalid JSON in request body" }));
      }

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ message: "Error reading file" }));
        }

        let books = [];
        try {
          books = data.trim() ? JSON.parse(data) : [];
        } catch (error) {
          books = [];
        }

        let maxId = 0;
        if (books.length > 0) {
          maxId = Math.max(...books.map((b) => b.id));
        }

        const newBook = {
          id: maxId + 1,
          title: reqBody.title,
          author: reqBody.author,
          price: reqBody.price,
          available: reqBody.available
        };

        books.push(newBook);

        fs.writeFile(filePath, JSON.stringify(books, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            return res.end(JSON.stringify({ message: "Error saving file" }));
          }

          res.writeHead(201);
          res.end(JSON.stringify(newBook));
        });
      });
    });
  } else if (method === "DELETE" && pathname.startsWith("/books/")) {
    const id = Number(pathname.split("/")[2]);

    if (isNaN(id)) {
      res.writeHead(400);
      return res.end(JSON.stringify({ message: "Invalid Book ID format" }));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ message: "Error reading file" }));
      }

      let books = [];
      try {
        books = data.trim() ? JSON.parse(data) : [];
      } catch (error) {
        books = [];
      }

      const updatedBooks = books.filter((book) => book.id !== id);

      if (updatedBooks.length === books.length) {
        res.writeHead(404);
        return res.end(JSON.stringify({ message: "Book not found" }));
      }

      fs.writeFile(filePath, JSON.stringify(updatedBooks, null, 2), (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ message: "Error saving file" }));
        }

        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: "Book deleted successfully",
          })
        );
      });
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});