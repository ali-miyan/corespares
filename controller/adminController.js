const loadadminlogin = async (req, res) => {
  try {
    res.render("admin-login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadadminlogin,
};
