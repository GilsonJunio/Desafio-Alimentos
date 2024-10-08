/*
08/10/2024
RETORNAR TODOS OS DADOS COMO OBJETO. 
COMO EU TÔ COM MUITA PREGUIÇA DE FAZER 
ISSO AGORA, OS DADOS SÃO COLETADOS 
NO EVENTO DE CLICK DO BOTÃO

TAMBÉM SERIA LEGAL DEFINIR UMA ÚNICA FUNÇÃO 
PARA EDITAR OU APAGAR

*/

const address = "http://localhost:6000"
const servicos = {
	enviar:"/enviarAlimentos",
	buscar:"/buscarAlimentos",
	editar:"/editarAlimentos"
}

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

	const camposMarcados = valoresMarcados.map(campoMarcado=>{return campoMarcado.name})

	return camposMarcados
}
let Dados_Fornecidos = ()=>{
	const dados = {
		alimento: campos.alimento.value
	 	data_de_validade: campos.datadevalidade.value
	 	fornecedor: campos.fornecedor.value
	 	estoque: campos.estoque.value
	 	descricao: campos.decricao.value
	 	imagem: campos.imagem.value
	 	preco: campos.preco.value
	}
	return dados		
}



async function Buscar_Dados(){
	const req = await fetch(address+servicos.buscar)
	const tratar = await req.json()

	console.log(tratar)
}

async function Enviar_Dados(dadosFornecidos,tipoDeAlimento){
	const req = await fetch(address+servicos.enviar,{
		method:'POST',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			dadosfornecidos:dadosFornecidos,
			tipodealimento:tipoDeAlimento
		})
	})
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

botoes.enviar.addEventListener('click',()=>{

	Enviar_Dados(Dados_Fornecidos(),Tipo_De_Alimento_Marcado())
})