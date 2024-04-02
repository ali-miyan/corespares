const dotenv = require("dotenv").config();

const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin-login");
  } catch (error) {
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (password === process.env.password && email === process.env.gmail) {
      res.json({ success: true });
    } else if(password !== process.env.password) {
      res.json({ wrongPass: true })
    }else if(email !== process.env.gmail){
      res.json({ wrongEmail: true })
    }
  } catch (error) {
    console.log(error);
  }
};

const loadDashboard = async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadAdminLogin,
  adminLogin,
  loadDashboard,
};
