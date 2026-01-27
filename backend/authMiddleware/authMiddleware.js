// // // import jwt from "jsonwebtoken";
// // // const SECRET_KEY = "mySecretKey";

// // // export const verifyToken = (req, res, next) => {
// // //   const authHeader = req.headers.authorization;
// // //   if (!authHeader)
// // //     return res.status(401).json({ message: "No token provided" });

// // //   const token = authHeader.replace("Bearer ", "").trim();

// // //   try {
// // //     const decoded = jwt.verify(token, SECRET_KEY);
// // //     req.user = decoded;
// // //     next();
// // //   } catch (err) {
// // //     res.status(401).json({ message: "Invalid or expired token" });
// // //   }
// // // };


// // import jwt from "jsonwebtoken";

// // const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";

// // export const verifyToken = (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// // console.log(authHeader);

// //   if (!authHeader) {
// //     return res.status(401).json({ message: "No token provided" });
// //   }

// //   const token = authHeader.split(" ")[1];
// //   if (!token) {
// //     return res.status(401).json({ message: "Malformed token" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, SECRET_KEY);
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: "Invalid or expired token" });
// //   }
// // };


// import jwt from "jsonwebtoken";
// const SECRET_KEY = "mySecretKey";

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   // console.log(authHeader,"authHeader");
  
//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1]; // safer split
//   if (!token)
//     return res.status(401).json({ message: "Malformed token" });

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "mySecretKey";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Ensure format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
