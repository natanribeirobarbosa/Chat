
/*
blacklistfunc()
 function blacklistfunc(){ 

	 for(let index = 0; index < variaveis.blacklist.length; index++){
			var user = variaveis.blacklist[index]

			onlineUsers.splice(onlineUsers.indexOf(user), 1)
			online.splice(online.indexOf(user), 1)
			variaveis.blacklist.splice(index, 1)

}
console.log('Varredura completa! Usuarios online: '+onlineUsers+', blacklist: '+variaveis.blacklist)
	for(let index2 = 0; index2 < onlineUsers.length; index2++){

		var user2 = onlineUsers[index2]
		variaveis.blacklist.push(user2)

	} 
			console.log('Escrita completa! Usuarios online: '+onlineUsers+online+', blacklist: '+variaveis.blacklist)

			setTimeout(blacklistfunc, 3000)
}*/
/*
var chat =(req, res) => {
	   	if(online.indexOf(req.session.name) == -1){
		online.push(req.session.name)
		
	}
	if(req.session.name == null){//Recebe um novo id caso seja sua primeira vez no site
		id++ 
		req.session.name = id
		
		}
		if(onlineUsers.indexOf(req.session.name)  != -1){
				//onlineUsers.splice(onlineUsers.indexOf(req.session.name), 1)
				onlineUsers.splice(pos, 1)
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
	
		
}}

module.exports = {chat, blacklist}*/