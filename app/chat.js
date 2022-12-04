
const express = require('express')
const app = express()
const flash = require('./lib/middleware/flash')
  const path = require('path')

const port = process.env.PORT || 3000
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
  
//definindo o middleware de mensagens flash
app.use(flash)

 
var id = 0
var mensagens = {}

var onlineUsers = []
var online = [-1]

var sol = {} //guarda as solicitações e as mensagens de cada solicitação

var names = {}

var blacklist = []
//var blacklist2 = []

app.get('/', (req, res) => {
	
	if(online.indexOf(req.session.name) == -1){
		online.push(req.session.name)
		
	}
var c;
	if(req.cookies.contatos != null){
		c = JSON.parse(req.cookies.contatos)
	var n = 0
	c.map((i) => {
				if(online.indexOf(i) == -1){
					c[n] = false	
				
		}else{
			c[n] = true
			n++
		}
	})
	}
	res.render('index', {cont: c})
	console.log('online users: '+onlineUsers+online)
})
   
   app.get('/chat/:nome', (req, res) => {
	   	if(online.indexOf(req.session.name) == -1){
		online.push(req.session.name)
		
	}
	var n = parseInt(req.params.nome)
	   console.log(online.indexOf())
	   
	   if(online.indexOf(n) != -1){
	   res.render('chat',{contato: n,message: true})
	   }else{
		   req.session.flash = 'Este úsuario: '+req.params.nome+' não está online no momento!'+online
				res.redirect('/')
	   }
	   
   })

 app.get('/config', (req, res) => {
	 res.render('config')
 }) 
   
app.get('/chat',  (req, res) => { 
	if(req.session.name == null){//Recebe um novo id caso seja sua primeira vez no site
		id++ 
		req.session.name = id
		
		}
		if(onlineUsers.indexOf(req.session.name)  != -1){
				//onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				req.session.flash = 'Feche a outra conversa ou espere alguns segundos e tente novamente!'
				res.redirect('/')
			
		}else{
				onlineUsers.push(req.session.name) 
			if(req.cookies.myName != undefined){
					names[req.session.name] = req.cookies.myName
				}else{
					names[req.session.name] = ''
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
			console.log('chegou até aqui!1')
			
			
		}else{	//Você é par,  Seu destino estará uma casa a frente...
			req.session.dest = user.position+1
			res.cookie('dest', user.position+1)
			res.send({message: 2, id: -1}) 
			res.end() 
			console.log('chegou até aqui!2')
		}

	 
		}
		}
		})  

app.get('/contatos/:nome', (req, res) => {
	req.session.dest = parseInt(req.params.nome) 
	
	if(onlineUsers.indexOf(dest) == -1){
		req.session.flash = 'Este contato não está online no momento!'+onlineUsers+', '+dest
	
				res.redirect('/')
	}else{
		
		res.render('chat', {message: 1, nome: names[req.session.dest], id: dest})
	}
})

blacklistfunc()
 function blacklistfunc(){ 

	 for(let index = 0; index < blacklist.length; index++){
			var user = blacklist[index]

			onlineUsers.splice(onlineUsers.indexOf(user), 1)
			online.splice(online.indexOf(user), 1)
			blacklist.splice(index, 1)

}
console.log('Varredura completa! Usuarios online: '+onlineUsers+', blacklist: '+blacklist)
	for(let index2 = 0; index2 < onlineUsers.length; index2++){

		var user2 = onlineUsers[index2]
		blacklist.push(user2)

	} 
			console.log('Escrita completa! Usuarios online: '+onlineUsers+online+', blacklist: '+blacklist)

			setTimeout(blacklistfunc, 3000)
}
/*
blacklistfunc2()
 function blacklistfunc2(){ 

	 for(let index = 0; index < blacklist2.length; index++){
			var user = blacklist2[index]

			online.splice(online.indexOf(user), 1)
			blacklist2.splice(index, 1)

}
console.log('Varredura completa! Usuarios online: '+online+', blacklist2: '+blacklist2)
	for(let index2 = 0; index2 < online.length; index2++){

		var user2 = online[index2]
		blacklist2.push(user2)

	} 
			console.log('Escrita completa! Usuarios online: '+online+', blacklist2: '+blacklist2)

			setTimeout(blacklistfunc2, 10000)
}*/
 
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
	 	if(blacklist.indexOf(req.session.name) != -1){
		blacklist.splice(blacklist.indexOf(req.session.name), 1)
	}
	 if(onlineUsers.indexOf(req.session.name)  == -1){
			res.send({m: 'erro'})
	 }else{
				
	 
	if(onlineUsers[req.session.dest] == undefined){

		res.send({m: false})
	}else{
		req.session.dest = onlineUsers[req.session.dest]
		 

		if(names[req.session.dest] == undefined){
			res.send({m: false})
		}else{
			
		
		res.send({m:true, nome: names[req.session.dest], id: req.session.dest})
		}
		
		
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
	 	delete names[req.session.name]
	  console.log("o user: "+req.session.name+" saiu! úsuarios online agora: "+onlineUsers)
	res.end()
	
	}
 })
 
   app.post('/api/bye2', (req, res) => {
	var pos = online.indexOf(req.session.name)
	


	if(pos == -1 || pos == undefined){
		res.end()
	}else{
		online.splice(pos, 1)
	 	delete names[req.session.name]
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
   