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
 

var id = 0
var mensagens = {}
var onlineUsers = []
var firstOnline = []
var blacklist = []

app.get('/', (req, res) => { 
	res.render('index')
	console.log('online users: '+onlineUsers+', Blacklist: '+blacklist+', mesagens: '+JSON.stringify(mensagens))

	
})
  
app.get('/chat', (req, res) => { 
	if(req.session.name == null){//Se for a primeira vez do úsuario no site
		id++ 
		req.session.name = id
		}
		
		if(onlineUsers.indexOf(req.session.name) == -1){//o úsuario está online? se não, agora está.
			onlineUsers.push(req.session.name)
			}else{
				onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				onlineUsers.push(req.session.name)
			}

		
		
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name)
							} 
		 
	mensagens[user.id] = []
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i = onlineUsers.indexOf(user.id)-1
			console.log( onlineUsers.indexOf(user.id)-1)
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = -1
		}
		
			if(onlineUsers.indexOf(user.dest) == -1){//o destino está online? se não, o user terá que esperar
				res.render('chat', {message: 1})
				console.log('Destino do user não existe...')
			}else{ 
				console.log('Destino existe...')
				res.render('chat', {message: 2}) 
			}
			 //console.log(req.session.dest)user
	console.log('"/" usuario '+req.session.name+' acabou de entrar, destino: '+req.session.dest+', variavel id:'+id+', usuarios online: '+JSON.stringify(onlineUsers))
})  

//setInterval(blacklistfunc, 3000)
blacklistfunc()
 function blacklistfunc(){ 
	console.log(blacklist)
	 for(let index = 0; index < blacklist.length; index++){
			var user = blacklist[index]
			var pos = onlineUsers.indexOf(user)
			
			onlineUsers.splice(pos, 1)
			blacklist.splice(index, 1)
			
}
console.log('Varredura completa! Usuarios online: '+onlineUsers+', blacklist: '+blacklist)
	for(let index2 = 0; index2 < onlineUsers.length; index2++){
		
		var user2 = onlineUsers[index2]
		blacklist.push(user2)
		
	} 
			console.log('Escrita completa! Usuarios online: '+onlineUsers+', blacklist: '+blacklist)
			
			setTimeout(blacklistfunc, 1000)
}

  

app.post('/api/online', (req, res) => { 
if( blacklist.indexOf(req.session.name) != -1){
	var pos = blacklist.indexOf(req.session.name)
	blacklist.splice(pos, 1)}
		
	if(onlineUsers.indexOf(req.session.name) == -1){//Você está online?
		res.send({envio: 1})
		
	}else{
		res.send({envio: 2})
	}
		
		res.end()
	
	
	
	//req.session.dest = null
	
})

app.post('/api/send', (req, res) => { 
	mensagens[req.session.dest].push(req.body.texto)
	console.log(req.body.texto)
	res.send({chave: 'valor'})
	
	res.end()
})  
 
app.post('/api/resp', (req, res) => {
	//console.log('destino: '+onlineUsers.indexOf(req.session.dest))
	//console.log(onlineUsers.indexOf(req.session.dest))
	if(onlineUsers.indexOf(req.session.dest) == -1){//O destino está online? se não, tchauzinho! 
		req.session.dest = null
		var pos = onlineUsers.indexOf(req.session.name)
		onlineUsers.splice(pos, 1)
		res.send({envio: 1}) 
		//console.log('O destino: '+req.session.dest+'Esta offline!')
	}else{
		if(mensagens[req.session.name].length != 0){
			var msg = mensagens[req.session.name][0]
			mensagens[req.session.name].splice(mensagens[req.session.name][0], 1)
			res.send({envio: 2, mensagem: msg}) 
		}else{
			res.send({envio: 2}) 
		}
		
		//console.log('O destino: '+req.session.dest+' Esta online!')
	}
	res.end()
})   
 
   
 app.post('/loading', (req, res) =>{
	 	var dest = onlineUsers.indexOf(req.session.name)+1
				req.session.dest = onlineUsers[dest]
	 
	if(onlineUsers.indexOf(req.session.dest) != -1){

		res.send({m: true})
	}else{
		res.send({m:false})
	}
	res.end()
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
   