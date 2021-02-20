const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
  let urlUser = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === userID) {
      urlUser[shortURL] = urlDatabase[shortURL].longURL;
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
