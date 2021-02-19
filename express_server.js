const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const morgan = require("morgan");
//const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
<<<<<<< HEAD
const { generateRandomString, findUserByEmail, UserUrls,
  userAuthentication, findUrl, userIdURLs, URLsforUser } = require("./helper");
=======
const {
  generateRandomString,
  findUserByEmail,
  UserUrls,
  userAuthentication,
  findUrl,
  userIdURLs,
  URLsforUser,
} = require("./helper");
>>>>>>> feature/user-registration

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// URLs Database
<<<<<<< HEAD
=======
//====================================================
>>>>>>> feature/user-registration
const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userId: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "user2RandomID" },
  b6UTxQ: { longURL: "https://www.tsn.ca", userId: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userId: "aJ48lW" },
};

// Users Database
<<<<<<< HEAD
=======
//====================================================
>>>>>>> feature/user-registration
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", salt),
  },
};

//====================================================
// (1) Get to Main Route / Login if Not
//====================================================
app.get(`/`, (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

//====================================================
// (2) Get New URL
//====================================================
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.redirect("/login");
  } else {
    const user = users[userId];
    let error = "";
    let templateVars = { error, user };
    res.render("urls_new", templateVars);
  }
});

// (2) Post New URL================================

app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!userId) {
    const error = "Please Register/ Login!";
    let templateVars = { user, error };
    res.render("urls_new", templateVars);
  } else {
    const userId = req.session.user_id;
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { longURL: longURL, userId: userId };

    res.redirect(`/urls/${shortURL}`);
  }
});

//====================================================
// (3) Get All URLs
//====================================================
app.get("/urls", (req, res) => {
  let error = "";
  const userId = req.session.user_id;
  const user = users[userId];
<<<<<<< HEAD
  console.log(user)
=======
  console.log(user);
>>>>>>> feature/user-registration
  const urls = UserUrls(urlDatabase, userId);
  // if (!userId) {
  //   error = "NOT Registered!!/ NOT Loggedin!!";
  // }
  let templateVars = { urls, user, error };
  res.render("urls_index", templateVars);
});

// (2) Post URLs
//================
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const newshortURL = generateRandomString();
  urlDatabase[newshortURL] = req.body.longURL;
  res.redirect("/urls");
});

//====================================================
// (4) Get: Update a URL
//====================================================
app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  const user = users[userId];

  const url = URLsforUser(userId, shortURL, urlDatabase);
  const error = url["error"];
  let longURL = "";
  if (!error) {
    longURL = url[shortURL].longURL;
  } else {
    shortURL = "???";
  }
  let templateVars = { url, user, error, shortURL, longURL };
  res.render("urls_show", templateVars);
});

// (4) Post: Update a URL
//===========================
app.post("/urls/:shortURL", (req, res) => {
  //extract the shortURL from the url req.params
  //extract the longURL from req.body ONLY if the user has this url in this database
  const userId = req.session.user_id;
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;

  const url = UserUrls(userId, shortURL, urlDatabase);
  const error = url["error"];
  //const longURL = url[shortURL].longURL;

  if (!error) {
    //Upadate the url in the database
    urlDatabase[req.params.shortURL] = longURL;
    res.redirect("/urls");
  } else {
    const user = users[userId];
    shortURL = "***";
    longURL = "";
    let templateVars = { user, error, shortURL, longURL };
    res.render("urls_show", templateVars);
  }
});

//====================================================
// (5) Get to Web Page using ShortURL
//====================================================
app.get("/u/:shortURL", (req, res) => {
  const shortUrl = req.params.shortURL;
  if (!urlDatabase[shortUrl]) {
    res.statusCode = 404;
    res.render("404");
  } else {
    const longUrl = urlDatabase[shortUrl].longURL;
    res.redirect(longUrl);
  }
});

//====================================================
// (6) Delete User URLs
//=======================================================
app.post("/urls/:shortURL/delete", (req, res) => {
  //extract the id from the url
  //req.params
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;

  const userUrlsFound = UserUrls(userId, shortURL, urlDatabase);
  const user = users[userId];
  const urls = userIdURLs(urlDatabase, userId);

  if (!userUrlsFound.error) {
    //   //delete it from the database
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
  // redirect to /urls
  const error = userUrlsFound.error;
  let templateVars = { urls, user, error };
  res.render("urls_index", templateVars);
});

//======================================================
// (7) Get: Register Form
//====================================================
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const error = "";
  let templateVars = { user, error };
  if (!userId) {
    res.render("register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// (7) Post: Register Form
//==========================
app.post("/register", (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    findUserByEmail(users, req.body.email)
  ) {
    let error = "ERROR!! ";
    error += findUserByEmail(users, req.body.email)
      ? "Email already exists!"
      : "Email/ Password cannot be empty!";
    res.statusCode = 400;
    const userId = req.session.user_id;
    const user = users[userId];
    let templateVars = { user, error };
    res.render("register", templateVars);
  } else {
    let newId = generateRandomString();
    const newPassword = bcrypt.hashSync(req.body.password, salt);
    let newUser = {
      id: newId,
      email: req.body.email,
      password: newPassword,
    };
    users[newId] = newUser;
    req.session.user_id = newId;
    //res.cookie("user_id", userId);
    res.status(200).redirect("/urls");
  }
});

//====================================================
// (8) Get: Login Form
//====================================================
app.get("/login", (req, res) => {
  const error = "";
  const userId = req.session.user_id;
  const user = users[userId];
  let templateVars = { user, error };
  if (!userId) {
    res.render("login", templateVars);
  } else {
    res.redirect("urls");
  }
});

// (8) Post: Login Form
//======================
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (userAuthentication(users, email, password)) {
    const userId = findUserByEmail(users, email);
    req.session.user_id = userId;
    res.redirect("urls");
  } else {
    const error = "Error Invalid email/password";
    res.statusCode = 403;
    const user = "";
    let templateVars = { user, error };
    res.render("login", templateVars);
  }
});

//====================================================
// (9) Get: Logout
//====================================================
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
// (9) Post: Logout
//==========================
app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect("urls");
});

//====================================================
// (10) Get: Error Page Not Found
//====================================================
app.get(`*`, (req, res) => {
  res.statusCode = 404;
  res.render("404");
});
//====================================================

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//====================================================
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.post("/urls", (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   res.send("Ok");         // Respond with 'Ok' (we will replace this)
// });

// app.post("/logout", (req, res) => {
//   res.clearCookie("username");
//   console.log("logout");
//   res.redirect("/urls");
<<<<<<< HEAD
// });
=======
// });
>>>>>>> feature/user-registration
