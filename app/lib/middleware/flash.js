module.exports = (req, res, next) => {
//console.log('middleware FLASH!')

	if(req.session.flash != null){
		res.locals.flash = req.session.flash
		console.log(req.session.flash)
		delete req.session.flash
	
	}
	
	next()
	}
	

