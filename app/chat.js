const express = require('express')
const app = express()
const flash = require('./lib/middleware/flash')
  const path = require('path')

const port = process.env.PORT || 8080
const { credentials } = require('./config')

//definindo o renderizador padrão 
app.set('views', path.join(__dirname, 'views'));
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
var blacklist = []
var names = {}

//definindo o middleware de mensagens flash
app.use(flash)


app.get('/', (req, res) => {

		if(req.cookies.novo == undefined){//Recebe um novo id caso seja sua primeira vez no site
		res.locals.flash = {message:'<p>O nosso site não funciona sem os cookies, ao continuar navegando, você concorda com a nossa política de privacidade.</p> <button onclick= "fechar()">ok</button>', type:'main', time: 1000} 
		res.locals.newU = 'Olá! seja bem vindo ao nosso site! aqui você pode conversar com pessoas aleatórias e desconhecidas! divirta-se!'
		id++ 
		req.session.name = id
		
		}

	res.render('index')


})


 
 app.get('/config', (req, res) => {
	res.render('config')
 }) 
 
  app.get('/sobre', (req, res) => {
	res.render('sobre')
 }) 
   
app.get('/chat',  (req, res) => {
		if(req.session.name == null){//Recebe um novo id caso seja sua primeira vez no site
		id++ 
		req.session.name = id
		
		}
	


		if(onlineUsers.indexOf(req.session.name)  != -1){
				//onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)

				res.redirect('/')
			
		}else{
				onlineUsers.push(req.session.name) 
			if(req.cookies.myName != undefined){
					names[req.session.name] = req.cookies.myName
				}else{
					names[req.session.name] = undefined
				}

				
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name)
							} 
							
		 
	mensagens[user.id] = []
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i =  user.position-1
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
			res.render('chat', {message: 1, nome: names[req.session.dest], id: req.session.dest})
			
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = user.position+1
			res.render('chat', {message: 2, id: -1}) 
		}

	
		
}})  



app.post('/api/chat2', (req, res) => { 
	if(req.session.name == null){//envia erro caso o user não tenha vindo de outra conversa

		res.send({erro: true})
		res.end()
		
		}else{
		if(onlineUsers.indexOf(req.session.name)  != -1){
			var pos = onlineUsers.indexOf(req.session.name)
			onlineUsers.splice(pos, 1)
			res.end()
		}else{
		
				onlineUsers.push(req.session.name)
				
						if(req.cookies.myName != undefined){
					names[req.session.name] = req.cookies.myName
				}else{
					names[req.session.name] = ''
				}
				
		var user = {id: req.session.name,
							position: onlineUsers.indexOf(req.session.name),
							dest: undefined
							
							}  
							
		 
	mensagens[user.id] = []
		 
		if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim,  seu destino é uma posição atrás no array
			var i =  user.position-1
			user.dest = onlineUsers[i]
			req.session.dest = user.dest
			res.send({message: 1, nome: names[req.session.dest], id: req.session.dest})  
			res.end()
		
			
			
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = user.position+1
			res.cookie('dest', user.position+1)
			res.send({message: 2, id: -1}) 
			res.end() 
	
		}

	 
		}
		}
		})  




blacklistfunc()
 function blacklistfunc(){ 

	 for(let index = 0; index < blacklist.length; index++){
			var user = blacklist[index]

			onlineUsers.splice(onlineUsers.indexOf(user), 1)
			//online.splice(online.indexOf(user), 1)
			blacklist.splice(index, 1)

}

	for(let index2 = 0; index2 < onlineUsers.length; index2++){

		var user2 = onlineUsers[index2]
		blacklist.push(user2)

	} 
	

			setTimeout(blacklistfunc, 3000)
}
 
app.post('/api/send', (req, res) => { 
	if(typeof(req.body.texto) != String){
		var a = req.body.texto.toString()
		mensagens[req.session.dest].push(a)
		res.send({sended: req.body.texto})
		res.end()
	}else{
	mensagens[req.session.dest].push(req.body.texto)
	
	res.send({sended: req.body.texto})
	res.end()
	
	}  
})   
app.post('/api/resp', (req, res) => {

	
	
	if(blacklist.indexOf(req.session.name) != -1){
		blacklist.splice(blacklist.indexOf(req.session.name), 1)
	}

	
	
	
	
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
			
			mensagens[req.session.name].splice(0, 1)
			res.send({"mensagem": msg}) 
		}else{
			res.end()
	}}
	}}

})   

   
 app.post('/loading', (req, res) =>{
	 nome=""
	 	if(blacklist.indexOf(req.session.name) != -1){
		blacklist.splice(blacklist.indexOf(req.session.name), 1)
	}
	 if(onlineUsers.indexOf(req.session.name)  == undefined){
			res.send({m: 'erro'})
	 }else{
		if(onlineUsers[req.session.dest] == undefined){
			res.send({m: false})
		}else{
			req.session.dest = onlineUsers[req.session.dest]
			if(names[req.session.dest] != undefined){
				nome=names[req.session.dest]
			}
				res.send({m:true, nome: nome, id: req.session.dest})
			
			
			
				}
		}
	 //console.log(req.session.dest+onlineUsers)

 })
 
 

 
  
 app.post('/api/bye', (req, res) => {
	var pos = onlineUsers.indexOf(req.session.name)
	
	mensagens[req.session.name] = []



	if(pos == -1){
		res.end()
	}else{
	 onlineUsers.splice(pos, 1)
	 	delete names[req.session.name]
	
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
   