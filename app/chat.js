/*

Para consertar o erro da var "id" sendo diminuida sem sentido, é só redirecionar o user para outra rota?????????????????????
-não
Para consertar o erro da var "id" sendo diminuida sem sentido, é só ao invés de fazer isso por um evento no front-end, um setTimeOut no back-end?????????????????
-não
Para consertar o erro da var "id" sendo diminuida sem sentido, é só arrumar um jeito de não recarregar a página e manipular os elementos de acordo com as respostas vindas do servidor, assim a view loading seria extinta???????????????????




Como funciona a aplicação?
	1-O user ganha um identificador que serve 

*/
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
		
}))
 
 

 

var id = 0 
var mensagens = {}

 //Esse middleware precisa ser executado sempre e apenas quando um úsuario entrar na página principal. 
 
 
app.get('/', (req, res) => { 
	//req.session.v = '1'
	res.render('index') 
	console.log('/, número de usuarios online: '+id) 
	console.log('/,'+JSON.stringify(mensagens)) 
	
	
})

app.post('/verifica', (req, res) => {
	if(req.session.log != undefined) {
		res.send('já tem uma guia aberta??'+req.session.name)
		
	}
	res.end()
})

app.get('/chat', (req, res) => {
	//console.log('req.session.id: '+req.session.id)
	 
	
	if(req.session.name == null){
		id++ 
		
		req.session.name = id  
		req.session.log = true 
		//req.session.mess = 0 
		console.log('/chat, o user nº: '+id+'ficou com o name: '+req.session.name)
		 
		//req.session.envios = {}  
		
		mensagens[req.session.name] = []  
		//console.log(mensagens)
		  
		 var número =  id % 2 
		if(número != 0){
			if(mensagens[id+1] == undefined){
			req.session.dest = id+1
			console.log('/chat, o user: '+id+' ficou com o dest: '+req.session.dest)
			res.render('chat', {mensagem: 1})
			req.session.log = req.session.name}else{
				
			}
			
		}else{ 
			req.session.dest = id-1
			console.log('/chat, o user: '+id+' ficou com o dest: '+req.session.dest)
			res.render('chat', {mensagem: 1}) 
			//req.session.log = req.session.name
			
			/*var contagemRegressiva = setTimeout(() => {
			mensagens[req.session.name] = undefined
		}, 10000)*/
			
		} 
	}else{  
		//console.log(mensagens)
		//if(mensagens[req.session.name] != undefined){
		//res.send('já tem uma guia aberta??'+req.session.name) 
			
		//}else{
		res.render('chat', {id: req.session.name})
		}
		
			/*var contagemRegressiva = setTimeout(() => {
			mensagens[req.session.name] = undefined
		}, 10000)*/
			
	
		//}
	 
	//   
	
})  
 

app.post('/api/send', (req, res) => {
	
	var dest = req.session.dest
	var mess = req.body.texto
	//console.log(dest,mess)
	//req.session.mess.push(mess) 
	//req.session.envios[dest].destinos[dest]= [[mess],['data']] 
	mensagens[`${dest}`].push(mess)  
	 //mensagens[name] 
	 
	//remetente[dest].push = [{mess: mess}]
	//console.log(remetente)
	//console.log(remetente)
	//mensagens[dest].dest = req.session.mess    
	//req.session.mess = 0 
	//console.log('99 - objeto com todas as mensagens: '+JSON.stringify(mensagens))
	res.send( {resp: '<b>'+mess+'</b>'})  
		 
})  
var contagemRegressiva = undefined
    /* function saidaForçada(name) { 
		 	var contagemRegressiva = setTimeout(() => { 
			mensagens[name] = undefined
		}, 5000)
		 
	 }*/ 
   
  
app.post('/api/resp', (req, res) => {
	 if(req.session.name > id){ 
		 id = req.session.name  
	 } 

		if(mensagens[req.session.dest] == undefined || mensagens[req.session.name] == undefined){  
		console.log('/api/resp o user:'+req.session.name+' perdeu o seu parceiro') 
		//req.session.log = null
	
		
		mensagens[req.session.name] = undefined
		req.session.name = null   
		req.session.dest = null  
		id=id-1
		res.send({mensagem: 1})
 
		res.end()
	} else{    
	
	   
	//console.log('/api/resp') 
	//var mensagensRecebidas = req.session.mess 
	var meuId = req.session.name
	var vetor = mensagens[meuId] 
	
	//console.log('id do user: '+req.session.name) 
	//console.log('mensagens do user: '+mensagens[meuId].length) 
	if(mensagens[meuId].length != 0){
 
	
		res.send({mensagem: vetor})
		mensagens[meuId].splice(0, vetor.length)
		//req.session.indice = 49
		 
 
	 
	
  
		}else{res.send({mensagem: null})}
	 
  }  
  
  
			//saidaForçada(req.session.name)
		 
})   

app.post('/api/bye', (req, res) => {
	if(req.session.name == null){
		res.end()
	}else{
	 
	
	//console.log('/api/resp, este é o middleware que apaga os dados logo depois...')
		//if(req.query == ) 
		//console.log('rota de sáida de usuario, req: '+JSON.stringify(req.query))
		
		//req.session.log = null
		mensagens[req.session.name] = undefined
		req.session.name = null
		//console.log(mensagens) 
		id-- 
		//mensagens[req.session.name] = [] 
		res.end()
	console.log('/api/bye - alguém saiu, o número de pessoas online no momento: '+id)}
	
})
 
  


 
 
 




 app.post('/loading', (req, res) =>{
	 //console.log(id)
		if(mensagens[req.session.dest] != undefined){
			res.send({res: true}) 
		}else(
			res.send({res: false}) 
		)
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
   