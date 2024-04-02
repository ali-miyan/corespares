const loadAdminLogin = async (req, res) => {
  try {
    res.render("admin-login");
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
    loadDashboard
};
