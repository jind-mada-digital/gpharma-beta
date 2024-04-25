const Autentification = (req, res, next) => {
  // if(sessionStorage.getItem('user_gpharma@2.0.0')){
  //     next()
  // }else{
  //     return res.status(500).json({message:'Authentifié vous d\'abord s\'il vous plaît.'})
  // }
  next();
};

module.exports = Autentification;
