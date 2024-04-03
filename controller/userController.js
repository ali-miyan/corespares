const loadUserHome = async (req, res) => {
    try {
        res.render("home");
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
};

const loadUserShop = async (req, res) => {
    try {
        res.render("products");
    } catch (error) {
        console.log(error);
        res.status(500).render('500');
    }
};

module.exports = {
    loadUserHome,
    loadUserShop
};
