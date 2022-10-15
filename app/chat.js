/*

Para consertar o erro da var "id" sendo diminuida sem sentido, é só redirecionar o user para outra rota?????????????????????
-não
Para consertar o erro da var "id" sendo diminuida sem sentido, é só ao invés de fazer isso por um evento no front-end, um setTimeOut no back-end?????????????????
-não
Para consertar o erro da var "id" sendo diminuida sem sentido, é só arrumar um jeito de não recarregar a página e manipular os elementos de acordo com as respostas vindas do servidor, assim a view loading seria extinta???????????????????




Como funciona a aplicação?
	1-O user ganha um identificador que serve 

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
		
}))
 

var id = 0 
var mensagens = {}

app.get('/', (req, res) => { 

	
	
})

app.get('/chat', (req, res) => {
	
})  

app.post('/api/send', (req, res) => {
	

		 
})  

app.post('/api/resp', (req, res) => {
	
})   

app.post('/api/bye', (req, res) => {

	
})
 
 app.post('/loading', (req, res) =>{

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
   