const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const {requireAuth} = require("@clerk/express")
const app = express();
//routes
const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const ticketRoutes = require('./routes/ticketRoutes')

dotenv.config();

// Apply middleware to all routes
app.use(cors());
app.use(express.json());

// Use `getAuth()` to protect a route based on authorization status
const hasPermission = (req, res, next) => {
  const auth = getAuth(req)
  console.log(auth);
  // Handle if the user is not authorized
  if (!auth.has({ permission: 'org:admin:example' })) {
    console.log("BLOCKED BY JAMES");
    return res.status(403).send('Forbidden')
  }

  return next();
}

app.use("/api/projects",projectRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req,res) =>{
  res.send("testing")
})

app.get("/api", (req, res) => {
  res.json({testing:[ "data", "from","backend"]});
});

app.get("api/projects", (req,res) =>{
  res.send("hi");
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));