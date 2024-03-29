const express = require('express')
const app = express()
const flash = require('./lib/middleware/flash')
  const path = require('path')

const port = process.env.PORT || 8080
const { credentials } = require('./config')
const { products } = require('./config')


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
app.use(express.static("views/images"));

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
var crushs = []
var blacklist = []
var acessos = 0

var names = {}
var sexo = {}
var writing = []

//definindo o middleware de mensagens flash
app.use(flash)

app.get('/siteMap', (req, res) => {
	res.send('https://www.ifriends.com.br/\n https://www.ifriends.com.br/chat')
})

app.use((req, res, next) => {
	if(req.session.name == null){//Recebe um novo id caso seja sua primeira vez no site
		id++ 
		req.session.name = id
		}

	if(blacklist.indexOf(req.session.name) != -1){
		blacklist.splice(blacklist.indexOf(req.session.name), 1)
	}
	next()
})




app.get('/', (req, res) => {
	acessos = acessos+1
		if(req.cookies.novo == undefined){//Recebe um novo id caso seja sua primeira vez no site
		res.locals.flash = {message:'<p>O nosso site não funciona sem os cookies, ao continuar navegando, você concorda com a nossa <a href="/politicadecookies">política de cookies</a>.</p> <button onclick= "fechar()">ok</button>', type:'main', time: 1000} 
		id++ 
		req.session.name = id
		
		}

		function getRandomInt(max) {
			return Math.floor(Math.random() * max);
		  }
		let a = products.products[getRandomInt(products.products.length)];
		

	res.render('index', {product: a})
})


 
 app.get('/config', (req, res) => {
	res.render('config')
 }) 
 
  app.get('/sobre', (req, res) => {
	res.render('sobre')
 }) 

  
 app.get('/politicadecookies', (req, res) => {
	res.render('cookies')
 })


   
app.get('/chat',(req, res) => {
		if(onlineUsers.indexOf(req.session.name)  != -1){
				onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)

				
			
		}
				if(crushs.indexOf(req.session.name)  != -1){
			crushs.splice(crushs.indexOf(req.session.name), 1)
	
		}
			



			if(req.cookies.myName != undefined && req.cookies.myName.length <= 10){
					names[req.session.name] = req.cookies.myName
				}else{
					names[req.session.name] = undefined
				}

				
		var user = {id: req.session.name} 
							
		 
	mensagens[user.id] = []
		 
	res.render('chat', {modo: 'onlineUsers'})
	
			
})  

app.get('/crushs',(req, res) => {
	if(onlineUsers.indexOf(req.session.name)  != -1){
			onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
			res.redirect('/')
		
	}else{
		if(crushs.indexOf(req.session.name)  != -1){
			crushs.splice(crushs.indexOf(req.session.name), 1)
	
		}else{

	
			if(blacklist.indexOf(req.session.name) == -1){
				blacklist.push(req.session.name)
			}
		if(req.cookies.myName != undefined && req.cookies.myName.length <= 10 && req.cookies.myName.length != 0){
				names[req.session.name] = req.cookies.myName
			}

		if(req.cookies.sex != undefined){
			sexo[req.session.name] = req.cookies.sex
		}
		
		

			
	var user = {id: req.session.name
						} 
						
	 
mensagens[user.id] = []
	 
res.render('chat', {modo: 'crushs'})

	
}}})




blacklistfunc()
async function blacklistfunc(){ 

	 for(let index = 0; index < blacklist.length; index++){
			var user = blacklist[index]
			var pos = onlineUsers.indexOf(user)
			var pos2 = crushs.indexOf(user)
			

			if(onlineUsers[pos] != -1){
				onlineUsers.splice(pos, 1)
			}
			
			if(crushs[pos2] != -1){
				crushs.splice(pos2, 1)
			}

			if(writing.indexOf(user) != -1){
				writing.splice(writing.indexOf(user), 1)
			}

			delete names[user]
			delete sexo[user]



			mensagens[user] = []
			

			
			blacklist.splice(index, 1)

}

	for(let index2 = 0; index2 < onlineUsers.length; index2++){

		var user2 = onlineUsers[index2]
		blacklist.push(user2)

	} 

	
		setTimeout(blacklistfunc, 2500)
}
 
app.post('/api/send', (req, res) => { 
	if(writing.indexOf(req.session.name) != undefined){
		writing.splice(writing.indexOf(req.session.name), 1)
	}

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
app.post('/api/resp/:modo', (req, res) => {

	let modo = null;
	
	switch (req.params.modo) {
		case 'normal':
			modo = onlineUsers;
		  break;
		case 'crushs':
			modo = crushs;
		  	break;
		default:
			modo = onlineUsers;;
	  }

	let wr = false;

	
	
	if(blacklist.indexOf(req.session.name) != -1){
		blacklist.splice(blacklist.indexOf(req.session.name), 1)
	}

	
	
	
	
	if(modo.indexOf(req.session.name) == -1){
		res.send({meOffline: true})
	}else{
	
	
	if(modo.indexOf(req.session.dest) == -1){//O destino está online? se não, tchauzinho! 
		req.session.dest = null
		var pos = modo.indexOf(req.session.name)
		modo.splice(pos, 1)
	
		
		res.send({offline: true})
		res.end()
		
	}else{
		if(writing.indexOf(req.session.dest) != -1){
			wr = true
		}
	
	if(mensagens[req.session.name].length == 0){
		res.send({"mensagem": undefined, writing: wr}) 
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



   
 app.post('/api/loading/:modo', (req, res) =>{
	let modo = null;
	
	switch (req.params.modo) {
		case 'normal':
			modo = onlineUsers;
		  break;
		case 'crushs':
			modo = crushs;
		  	break;
		default:
			modo = onlineUsers;;
	  }
	  if(modo.indexOf(req.session.name) == -1){
		modo.push(req.session.name) 
	  }

	 var user = {
		name: "???",
		id: req.session.name,
		position: modo.indexOf(req.session.name),
		sex: null
		} 
	
	
	
	


	 if(user.position % 2 != 0){//A posição do úsuario no array é impar? se sim, seu destino é uma posição atrás no array
		var i =  user.position-1
		user.dest = modo[i]
		req.session.dest = user.dest
		if(names[req.session.dest] != undefined && names[req.session.dest] != ''){
			user.name=names[req.session.dest]
		}
		if(sexo[req.session.dest] != undefined){
			user.sex = sexo[req.session.dest]
		}
		res.send({m:true, nome: user.name, id: req.session.dest, sex: user.sex})
		
	}else{	//Você é par,  Seu destino estará uma casa a frente...
		let pos = user.position+1
		if(modo[pos] !== undefined && names[req.session.dest] != ''){
			req.session.dest = modo[pos]
			if(names[req.session.dest] != undefined){
				user.name = names[req.session.dest]
			}
			
			if(sexo[req.session.dest] != undefined){
				user.sex = sexo[req.session.dest]
				
			}
			res.send({m:true, nome: user.name, id: req.session.dest, sex: user.sex})
		}else{
		res.send({m:false})
		}
	}
	if(blacklist.indexOf(req.session.name) == -1){
		blacklist.push(req.session.name)
	}
	 
 })
 
 app.post('/api/writing', (req, res) => {
	if(writing.indexOf(req.session.name) == -1){
		writing.push(req.session.name)
	}

	res.end()

 })

 
  
 app.post('/api/bye', (req, res) => {
	var pos = onlineUsers.indexOf(req.session.name)
	var pos2 = crushs.indexOf(req.session.name)
	mensagens[req.session.name] = undefined

		if(writing.indexOf(req.session.name) != -1){
				writing.splice(writing.indexOf(req.session.name), 1)
			}




	if(pos != -1){
		onlineUsers.splice(pos, 1)
	}
	if(pos2 != -1){
		crushs.splice(pos2, 1)
	}
	 
	 
	 delete names[req.session.name]
	 delete sexo[req.session.name]
	
	res.end()
	
	
 })

 app.get('/administrador', (req, res, next) => {
	res.render('admin')
 })


 app.post('/api/administrador', (req, res, next) => {
	console.log(req.body.senha)
	if(req.body.senha == 'meusDados'){
		res.send({result: true, online: onlineUsers.length})
		console.log('sucess')
	}else{
		res.sendStatus(500)
	}
 })

 app.post('/products', (req, res) => {
	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }
	let a = getRandomInt(products.products.length);
	res.json(products.products[a])
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
 `Express started on http://localhost:${port}, and in ${app.get('env')} mode.; `
 + `press Ctrl-C to terminate.`))
   