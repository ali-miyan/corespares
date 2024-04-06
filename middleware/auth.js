const isLogin = (req, res, next) => {
    try {
      if (req.session.email) {
        next();
      } else {
        res.redirect('/admin');
      }
    } catch (error) {
      console.error(error.message);
      res.redirect('/admin/login'); 
    }
  };

  const isLogout = async (req,res,next)=>{

    try {
        
        if (req.session.email) {
            res.redirect('/admin/category')
        } else {
            next();
        }
        
    } catch (error) {
        
        console.log(error.message);

    }
}


  module.exports = {
    isLogin,
    isLogout
  }