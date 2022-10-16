/*

variavel id = serve para nomear os úsuarios com um "id".
array onlineUsers = serve para definir com quem cada pessoa irá conversar.

*/


//isso vai para o branch "vetor"
const express = require('express')
const app = express()

const port = process.env.PORT || 3000
const { credentials } = require('./config')
//definindo o renderizador padrão 
const handleBars = require('express-handlebars');
app.engine('handlebars', handleBars.engine({
	dafaultLayout: 'main',
	helpers: {
		section: function(name, options) {
			if(!this._sections) this._sections = {}
			this._sections[name] = options.fn(this)
			return null
		},
	},
}))
app.set('view engine', 'handlebars')

//configurando o bodyParser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//configurando o cookie-parser
const cookieParser = require('cookie-parser') 
app.use(cookieParser(credentials.cookieSecret))

//configurando o express-session
const expressSession = require('express-session')
app.use(expressSession({
	resave: false, 
	saveUninitialized: false,
	secret: credentials.cookieSecret, 
	maxAge: 30 * 24 * 60 * 60 * 1000
}))
 

var id = -1
var mensagens = {}
var onlineUsers = []

app.get('/', (req, res) => { 
	res.render('index')

	
})
  
app.get('/chat', (req, res) => { 
	
	
	if(req.session.name == null){//Se for a primeira vez do úsuario no site
		id++ 
		req.session.name = id
		}
		
		if(onlineUsers.indexOf(req.session.name) == -1){//o úsuario está online? se não, agora está.
			onlineUsers.push(req.session.name)
			}
		
		
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name)
							} 
		 
		if(req.session.dest == undefined){ //Já tem um destino definido? caso não arranjamos um novo!
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i = onlineUsers.indexOf(user.id)-1
			console.log( onlineUsers.indexOf(user.id)-1)
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
		}else{//Então é ... Seu destino estará uma casa a frente...
			var i = onlineUsers.indexOf(user.id)+1
			if(onlineUsers[i] == undefined){//Já existe um destino? se não, terá de esperar
				user.dest = -1
			}else{
				user.dest = onlineUsers[i]
				req.session.dest = user.dest
			} 
		}
		}
			
			if(onlineUsers.indexOf(user.dest) == -1){//o destino está online? se não, o user terá que esperar
				res.render('chat', {message: 1})
			}else{
				res.render('chat', {message: 2}) 
			}
			 //console.log(req.session.dest)user
	console.log('"/" usuario '+req.session.name+' acabou de entrar, destino: '+req.session.dest+', variavel id:'+id+', usuarios online: '+JSON.stringify(onlineUsers))
})  

app.post('/api/send', (req, res) => { 
	
})  
 
app.post('/api/resp', (req, res) => {
	//console.log('destino: '+onlineUsers.indexOf(req.session.dest))
	if(onlineUsers.indexOf(req.session.dest) == -1){//O destino está online? se não, tchauzinho! 
		res.send({envio: 1}) 
		//console.log('O destino: '+req.session.dest+'Esta offline!')
	}else{
		res.send({envio: 2}) 
		//console.log('O destino: '+req.session.dest+' Esta online!')
	}
})   
 
app.post('/api/bye', (req, res) => {
	var pos = onlineUsers.indexOf(req.session.name)
	onlineUsers.splice(pos, pos)
	console.log('"/api/bye" O úsuario '+req.session.name+' ficou offline! pessoas online no momento: '+onlineUsers)
	res.redirect(303, '/')
})
 
 app.post('/loading', (req, res) =>{
		var pos = onlineUsers.indexOf(req.session.name)

			if(onlineUsers.indexOf(req.session.name+1) == -1){//O destino está online? se não, tchauzinho!
				res.send({m: false})
			}else{
				req.session.dest = onlineUsers.indexOf(req.session.name+1)
				res.send({m: true})
			}
 })
  
// página 404 personalizada 
app.use((req, res) => {
 res.type('text/plain')
 res.status(404)
 res.send('404 - Not Found')
})
// página 500 personalizada 
app.use((err, req, res, next) => {
 console.error(err.message) 
 res.type('text/plain')
 res.status(500)
 res.send('500 - Server Error')
})
app.listen(port, () => console.log(
 `Express started on http://localhost:${port}; `
 + `press Ctrl-C to terminate.`))
   