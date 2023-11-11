import { API } from "../../backend";
//NOTE: API means http://localhost:8000/api/

//NOTE: fetch() returns promise which will either give success or error
export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

//NOTE: storing cookies into user's browser
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data)); // converting JavaScript object into string
    next();
  }
};

export const signout = (next) => {  //next provides us a callback
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
  }

  return fetch(`${API}/signout`, {
    method: "GET",
  })
    .then((response) => console.log("Sign Out Successfully"))
    .catch((err) => console.log(err));
};

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));  //converting string into JavaScript object.
  } else {
    return false;
  }
};
