module.exports = (req, res, next) => {

	if(req.session.flash != null){
		res.locals.flash = req.session.flash
		delete req.session.flash
	
	}
	
	next()
	}
	
