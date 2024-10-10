/*
08/10/2024
RETORNAR TODOS OS DADOS COMO OBJETO. 
COMO EU TÔ COM MUITA PREGUIÇA DE FAZER 
ISSO AGORA, OS DADOS SÃO COLETADOS 
NO EVENTO DE CLICK DO BOTÃO

TAMBÉM SERIA LEGAL DEFINIR UMA ÚNICA FUNÇÃO 
PARA EDITAR OU APAGAR

09-10-2024
ADICIONAR UM FOR NA FUNÇÃO DADOS FORNECIDOS

*/

const address = "http://localhost:6000"
const servicos = {
	enviar:"/enviarAlimentos",
	buscar:"/buscarAlimentos",
	editar:"/editarAlimentos"
}

let textarea = document.getElementsByTagName('textarea') 
let campos = document.getElementsByTagName('input')
let botoes = document.getElementsByTagName('button')

let Tipo_De_Alimento_Marcado = ()=>{
	const fruta = campos.checkboxFruta
	const enlatado = campos.checkboxEnlatado
	const vegetal = campos.checkboxVegetal

	const valores =[fruta,enlatado,vegetal]
	const valoresMarcados = valores.filter(valor =>{if(valor.checked === true){console.log(valor.name);return valor.name}})

	if(valoresMarcados.length > 1){
		alert("SELECIONE APENAS UM TIPO DE ALIMENTO!")
		return "Usuário selecionou mais de um tipo de alimento"
	}
	else{
		console.log(valoresMarcados)
		const camposMarcados = valoresMarcados.map(campoMarcado=>{
			console.log(campoMarcado)
			if(campoMarcado.name ==='checkboxFruta'){
				return 'fruta'
			}
			else if(campoMarcado.name ==='checkboxVegetal'){
				return 'vegetal'
			}
			else if(campoMarcado.name === 'checkboxEnlatado'){
				return 'enlatado'
			}
		})
		if(camposMarcados.length===0){
			alert('Por favor, marque um tipo de alimento!')
			return undefined
		}
		else{
			console.log(camposMarcados)
			return camposMarcados[0]
		}
	}
}
let Dados_Fornecidos = ()=>{
	const dados = {
		alimento: campos.alimento.value,
	 	data_de_validade: campos.datadevalidade.value,
	 	fornecedor: campos.fornecedor.value,
	 	estoque: campos.estoque.value,
	 	descricao: textarea.descricao.value,
	 	imagem: campos.imagem.value,
	 	preco: campos.preco.value,
	}
	const dadosParaEnviar = [
		dados.alimento,
		dados.data_de_validade,
		dados.fornecedor,
		dados.estoque,
		dados.descricao,
		dados.imagem,
		dados.preco
		]
	console.log(dadosParaEnviar)
	const existemDadosVazios = dadosParaEnviar.find(dado =>{return dado === ""})
	console.log(existemDadosVazios)
	if(existemDadosVazios === ''){
		alert("Existem dados vazios!")
	}
	else{
		return dados		

	}
	/*
	for(i in dados){
		console.log(i)
		console.log(dados.alimento)
	}
	*/
}



async function Buscar_Dados(){
	const req = await fetch(address+servicos.buscar)
	const tratar = await req.json()
	console.log(tratar)
	return tratar
}

function Adicionar_Botoes_De_Apagar_e_Editar(){
	const tr = document.getElementsByTagName('tr')
	const td = document.getElementsByTagName('td')
	const 
	for (let i = 1;i<tr.length; i++){
		const checkboxSelecionar = document.createElement('input')
		checkboxSelecionar.type='checkbox'
		checkboxSelecionar.name=`checkbox_${i}`
		console.log(i)
		tr[i].appendChild(checkboxSelecionar)
	}
}
function Reconhecer_Checkboxes(){
	const checkboxes = document.getElementsByTagName('input')
	const checkboxesEditar = []

	for(let i = 1; i<=checkboxes.length; i++){
		//checkboxesEditar.push(checkboxes.namedItem(`checkbox_${i}`))
		//console.log(checkboxes.namedItem(`checkbox_${i}`))
		if(checkboxes.namedItem(`checkbox_${i}`)!= null){
			checkboxesEditar.push(checkboxes.namedItem(`checkbox_${i}`))
			//console.log(checkboxes.namedItem(`checkbox_${i}`))
			//console.log('-----------------------------------')
			console.log(checkboxesEditar)
			return checkboxesEditar

		}

	}
}
function Reconhecer_Linhas(){

}
function Habilitar_Edicao(){
	const checkboxes = document.getElementsByTagName('input')
}

function Renderizar_Dados(){
	const buscar = Buscar_Dados()
	const table = document.getElementsByTagName('table')[0]
	buscar.then(dados =>{
		console.log(dados)
		dados.map(dado=>{
			let tr = document.createElement('tr')
			tr.id=dado.id
			
			let tdFruta = document.createElement('td')
			tdFruta.textContent = dado.nome;
			
			let tdDataDeValidade = document.createElement('td')			
			tdDataDeValidade.textContent =dado.data_de_validade; 
			
			let tdFornecedor = document.createElement('td')			
			tdFornecedor.textContent = dado.fornecedor;
			
			let tdDescricao = document.createElement('td')			
			tdDescricao.textContent = dado.descricao;
			
			let tdImagem = document.createElement('td')			
			tdImagem.textContent = dado.url_imagem;
						
			let tdTipoDeAlimento = document.createElement('td')			
			tdTipoDeAlimento.textContent = dado.tipo_de_alimento;
			
			let tdPreco = document.createElement('td')			
			tdPreco.textContent = dado.preco;
			
			let tdEstoque = document.createElement('td')
			tdEstoque.textContent = dado.estoque;

			let acoes = document.createElement('td')
			
/*			let botaoEditar = document.createElement('button')
			botaoEditar.textContent ="EDITAR"
			botaoEditar.name ="editar"
			let botaoApagar = document.createElement('button')
			botaoApagar.textContent ="APAGAR"
			botaoApagar.name ="apagar"
*/
			table.appendChild(tr)
			tr.appendChild(tdFruta)
			tr.appendChild(tdTipoDeAlimento)
			tr.appendChild(tdFornecedor)
			tr.appendChild(tdDataDeValidade)
			tr.appendChild(tdPreco)
			tr.appendChild(tdEstoque)
			tr.appendChild(tdDescricao)
			tr.appendChild(tdImagem)
			tr.appendChild(acoes)
/*			acoes.appendChild(botaoEditar)
			acoes.appendChild(botaoApagar)
*/		})
	}) 
}
Renderizar_Dados()
async function Enviar_Dados(dadosFornecidos,tipoDeAlimento){
	if(dadosFornecidos===undefined || tipoDeAlimento===undefined){
		return
	}
	else{
		const req = await fetch(address+servicos.enviar,{
			method:'POST',
			headers:{'Content-Type':'Application/JSON'},
			body:JSON.stringify({
				dadosfornecidos:dadosFornecidos,
				tipodealimento:tipoDeAlimento
			})
		})
	}
}

async function Editar_Dados(dados){
	const req = await fetch(address+servicos.enviar,{
		method:'PUT',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			dadosparaeditar:dados
		})
	})
}
async function Apagar_Dados(dados){
	const req = await fetch(address+servicos.enviar,{
		method:'DELETE',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			dadosparaeditar:dados
		})
	})
}

function editar(botaoClicado){
	const parent = botaoClicado.parentElement
	const grandparent = parent.parentElement
	console.log(grandparent)
/*	const tr = document.getElementsByTagName('tr')
	const trChildren = tr.children
	for (let i =1; i<tr.length;i++){
		console.log(i)

	}*/
}

botoes.enviar.addEventListener('click',()=>{
	Enviar_Dados(Dados_Fornecidos(),Tipo_De_Alimento_Marcado())
	Renderizar_Dados()
})

