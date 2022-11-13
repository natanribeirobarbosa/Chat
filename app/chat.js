
const express = require('express')
const app = express()
const flash = require('./lib/middleware/flash')

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
  
//definindo o middleware de mensagens flash
app.use(flash)


var id = 0
var mensagens = {}
var onlineUsers = []
var firstOnline = []
var blacklist = []

app.get('/', (req, res) => { 
	res.render('index')
	console.log('online users: '+onlineUsers+', Blacklist: '+blacklist+', mesagens: '+JSON.stringify(mensagens))
})
  
app.get('/chat', async (req, res) => { 
	if(req.session.name == null){//Recebe um novo id caso seja sua primeira vez no site
		id++ 
		req.session.name = id
		
		}
		if(onlineUsers.indexOf(req.session.name)  != -1){
				//onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				req.session.flash = {
					type: 'flashDanger',
					message: '<h1>Erro!</h1>'
				}
				res.redirect('/')
			
		}else{
				onlineUsers.push(req.session.name) 
				
				res.cookie('id', req.session.name)
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name)
							} 
							
		 
	mensagens[user.id] = []
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i =  user.position-1
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
			res.render('chat', {message: 1})
			
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = user.position+1
			res.cookie('dest', user.position+1)
			res.render('chat', {message: 2}) 
		}
	
	console.log('"/" usuario '+req.session.name+' acabou de entrar, destino: '+req.session.dest+', variavel id:'+id+', usuarios online: '+JSON.stringify(onlineUsers))
	
		}})  



app.post('/api/chat2', (req, res) => { 
	if(req.session.name == null){//envia erro caso o user não tenha vindo de outra conversa
	console.log('requisição feita!')
		res.send({erro: true})
		res.end()
		}else{
		if(onlineUsers.indexOf(req.session.name)  != -1){
			var pos = onlineUsers.indexOf(req.session.name)
			onlineUsers.splice(pos, 1)
			res.end()
		}else{
		
				onlineUsers.push(req.session.name)
				res.cookie('id', req.session.name)
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name)
							}  
							
		 
	mensagens[user.id] = []
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i =  user.position-1
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
			res.send({message: 1})
			res.end()
			console.log('chegou até aqui!1')
			
			
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = user.position+1
			res.cookie('dest', user.position+1)
			res.send({message: 2}) 
			res.end()
			console.log('chegou até aqui!2')
		}
	console.log('chegou até aqui!3')
	console.log('"/" usuario '+req.session.name+' acabou de entrar, destino: '+req.session.dest+', variavel id:'+id+', usuarios online: '+JSON.stringify(onlineUsers))
	 
		}
		}
		})  




 
app.post('/api/send', (req, res) => { 
	mensagens[req.session.dest].push(req.body.texto)
	console.log(req.body.texto)
	res.json({sended: req.body.texto})
	res.end()
	

})  
 
app.post('/api/resp', (req, res) => {
	//console.log('destino: '+onlineUsers.indexOf(req.session.dest))
	//console.log(onlineUsers.indexOf(req.session.dest))
	
	
	
	
	
	
	
	if(onlineUsers.indexOf(req.session.name) == -1){
		res.send({meOffline: true})
	}else{
	
	
	if(onlineUsers.indexOf(req.session.dest) == -1){//O destino está online? se não, tchauzinho! 
		req.session.dest = null
		var pos = onlineUsers.indexOf(req.session.name)
		onlineUsers.splice(pos, 1)
	
		
		res.send({offline: true})
		res.end()
		//console.log('O destino: '+req.session.dest+'Esta offline!')
	}else{
	
	if(mensagens[req.session.name].length == 0){
		res.send({"mensagem": undefined}) 
	}else{
	
		var msg = []
		msg.push(mensagens[req.session.name][0])
		if(msg.length != 0){
			
			mensagens[req.session.name].splice(mensagens[req.session.name][0], 1)
			res.send({"mensagem": msg}) 
		}else{
			res.end()
	}}
	}}

})   
 
   
 app.post('/loading', (req, res) =>{
	 if(onlineUsers.indexOf(req.session.name)  == -1){
			res.send({m: 'erro'})
	 }else{
				
	 
	if(onlineUsers[req.session.dest] == undefined){

		res.send({m: false})
	}else{
		var dest = onlineUsers[req.session.dest]
		res.cookie('dest', dest)
		req.session.dest = dest
		res.send({m:true})
	 }}
	res.end() 
 })
  
 app.post('/api/bye', (req, res) => {
	var pos = onlineUsers.indexOf(req.session.name)
	mensagens[req.session.name] = undefined
	if(pos == -1){
		res.end()
	}else{
	 onlineUsers.splice(pos, 1)
	 
	  console.log("o user: "+req.session.name+" saiu! úsuarios online agora: "+onlineUsers, pos)
	res.end()
	
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
   