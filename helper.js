const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// // URLs Database
// //====================================================
// const urlDatabase = {
//   b2xVn2: { longURL: "http://www.lighthouselabs.ca", userId: "userRandomID" },
//   "9sm5xK": { longURL: "http://www.google.com", userId: "user2RandomID" },
//   b6UTxQ: { longURL: "https://www.tsn.ca", userId: "aJ48lW" },
//   i3BoGr: { longURL: "https://www.google.ca", userId: "aJ48lW" },
// };

// // Users Database
// //====================================================
// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds),
//   },
//   user2RandomID: {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: bcrypt.hashSync("dishwasher-funk", saltRounds),
//   },
// };

//====================================================
// Generate a Random String
//====================================================
function generateRandomString() {
  const str = Math.random().toString(36).substring(7);
  return str;
}

//====================================================
// Get a User by Email
//====================================================
const findUserByEmail = (users, email) => {
  console.log("Email = ", email);
  for (let userId in users) {
    if (users[userId].email === email) {
      console.log("Email = ", users[userId]);
      return users[userId];
    }
  }
  return false;
};

//====================================================
// Find all URLs for a Specific User
//====================================================
const UserUrls = function (urlDatabase, userID) {
  console.log("DB ", urlDatabase, userID);
  let url = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === userID) {
      url[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return url;
};

//===============================================================
// Function Validates an Email & a Password with the UserDatabase
//===============================================================
const userAuthentication = function (users, email, password) {
  //console.log("User:", users, email, password);
  const user = findUserByEmail(users, email);
  const id = user.id;
  console.log("id ", id);
  if (id) {
    // email found, check the password next
    if (bcrypt.compareSync(password, users[id].password)) {
      // Success! GOOD Password
      return true;
    } else {
      return false;
    }
  } else {
    console.log("Bad Email!");
    return false;
  }
};
//====================================================
// Function Returns a URL by a Given shortURL
//====================================================
const findUrl = function (urlDatabase, shortURL) {
  const url = {};
  if (urlDatabase[shortURL]) {
    url[shortURL] = urlDatabase[shortURL];
  }
  return url;
};

//====================================================
// Function Returns Urls for an Autherized User
//====================================================
const userIdURLs = function (urlDatabase, userID) {
  console.log("DB in userIdURLs: ", urlDatabase, "UserId: ", userID);
  let urlUser = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === userID) {
      //????????????????????????????????????
      urlUser[shortURL] = urlDatabase[shortURL];
    }
  }
  return urlUser;
};

//====================================================
// Function Returns a URL accessed by a specific User
//====================================================
const findURLforSpecificUser = function (userId, shortURL, urlDatabase) {
  let error = "";
  let url = {};
  if (!urlDatabase[shortURL]) {
    error = "This URL does not exist!";
    return { url, error };
  }
  const urls = userIdURLs(urlDatabase, userId);
  url = findUrl(urls, shortURL);
  if (!url[shortURL]) {
    if (!userId) {
      error = "Register or login first!";
    } else {
      error = "Bad request! You don't have access to this URL!";
    }
  }
  url["error"] = error;
  console.log("specific Url for a user :", url);
  return url;
};
//============================================================

module.exports = {
  generateRandomString,
  findUserByEmail,
  UserUrls,
  userAuthentication,
  userIdURLs,
  findURLforSpecificUser,
};
