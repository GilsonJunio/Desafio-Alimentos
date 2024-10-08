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

	//console.log(valoresMarcados)
	const camposMarcados = valoresMarcados.map(campoMarcado=>{return campoMarcado.name})
	console.log(camposMarcados)

	return camposMarcados

}
//tipoDeAlimentoMarcado()


async function Buscar_Dados(){
	const req = await fetch(address+servicos.buscar)
	const tratar = await req.json()

	console.log(tratar)
}
//buscarDados()


async function Enviar_Dados(alimento,tipoDeAlimento){
	const req = await fetch(address+servicos.enviar,{
		method:'POST',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			alimento:alimento,
			tipodealimento:tipoDeAlimento
		})
	})
}


botoes.enviar.addEventListener('click',()=>{
	let alimento = campos.alimento.value
	Enviar_Dados(alimento,Tipo_De_Alimento_Marcado())
})