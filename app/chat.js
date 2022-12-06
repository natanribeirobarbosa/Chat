
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



//rotas
var chat = require('./rotas/random')
 
var id = 0
var mensagens = {}




var sol = {} //guarda as solicitações e as mensagens de cada solicitação

var names = {}


//var blacklist2 = []

app.get('/', (req, res) => {
	
	if(chat.online.indexOf(req.session.name) == -1){
		chat.online.push(req.session.name)
		
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


})
   
   app.get('/chat/:nome', (req, res) => {
	   	if(online.indexOf(req.session.name) == -1){
		online.push(req.session.name)
		
	}
	
	if(onlineUsers.indexOf(req.session.name)  != -1){
				onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				//onlineUsers.splice(pos, 1)
				req.session.flash = 'Feche a outra conversa ou espere alguns segundos e tente novamente!'
				res.redirect('/')
			
		}else{
				onlineUsers.push(req.session.name) 
	var n = parseInt(req.params.nome)
	
	   
	   if(online.indexOf(n) != -1){
	   res.render('chat2',{contato: n,message: true})
	   }else{
		   req.session.flash = 'Este úsuario: '+req.params.nome+' não está online no momento!'+online
				res.redirect('/')
	   }
		}
   })

 app.get('/config', (req, res) => {
	 res.render('config')
 }) 
   
app.get('/chat',  chat.chat)  



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

app.get('/contatos/:nome', (req, res) => {
	req.session.dest = parseInt(req.params.nome) 
	
	if(onlineUsers.indexOf(dest) == -1){
		req.session.flash = 'Este contato não está online no momento!'+onlineUsers+', '+dest
	
				res.redirect('/')
	}else{
		
		res.render('chat', {message: 1, nome: names[req.session.dest], id: dest})
	}
	
})


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

app.post('/sol/:contato', (req, res) => {
	if(sol[req.params.contato] == undefined){
		sol[req.params.contato] = []
	}
	sol[req.params.contato].push(req.body.texto)
	
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

app.post('/api/resp2', (req, res) => {
	res.send('sucesso.')
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
	
	mensagens[req.session.name] = []

	if(pos == -1){
		res.end()
	}else{
	 onlineUsers.splice(pos, 1)
	 	delete names[req.session.name]
	
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
   