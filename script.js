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
/*
NOTAS:
13-10-2024
Cara, esse projetinho aqui me deu uma dorzinha de cabeça viu
Resumidamente, a função Adicionar_Botoes_De_Apagar_e_Editar não
estava adicionando os botões de Editar e Apagar nas células de
ações quando eu chamava pelo corpo do código. Então eu imaginei 
que provavelmente o DOM não carregava rápido o suficiente ao ponto 
que função conseguisse realizar sua função apropriadamente e realmente
era isso mesmo.

Eu tentei algumas soluções como chamar a função dentro da função
Renderizar_Dados, fiz alguns outros punctures mas infelizmente não
funcionaram. Eu imaginei que fosse problema com o método getelements
ByTagName. Então tentei mudar para class e usar o método querySelect
orAll(), mas tambémnão funcionou.

Então eu lembrei das Promises, as quais tecnicamente só permitem ao 
restante do código funcionar caso ela seja cumprida, e foi isso o 
que eu fiz. Movi o código dentro da função Renderizar_Dados responsável 
pela renderização dos dados para dentro de uma promise e em seguida chamei
a função Adicionar_Botoes_De_Apagar_e_Editar.

Não sei dizer ao certo se a adição de async na função Renderizar_Dados
para tratar os dados com await faz alguma diferença na promise, mas posso
testar isso posteriormente

*/

const address = "http://localhost:6000"
const servicos = {
	enviar:"/enviarAlimentos",
	buscar:"/buscarAlimentos",
	editar:"/editarAlimentos",
	remover:"/removerAlimentos"

}

let textarea = document.getElementsByTagName('textarea') 
let campos = document.getElementsByTagName('input')
let botoes = document.getElementsByTagName('button')
let linhas = document.getElementsByTagName('tr')
const acoes = document.getElementsByClassName('acoes')
const td = document.getElementsByTagName('td')


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
		//console.log(valoresMarcados)
		const camposMarcados = valoresMarcados.map(campoMarcado=>{
			//console.log(campoMarcado)
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
		dados.preco]
	console.log(dadosParaEnviar)
	const existemDadosVazios = dadosParaEnviar.find(dado =>{return dado === ""})
	console.log(existemDadosVazios)
	if(existemDadosVazios === ''){
		alert("Existem dados vazios!")
	}
	else{
		return dados		

	}
}



async function Buscar_Dados(){
	const req = await fetch(address+servicos.buscar)
	const tratar = await req.json()
	return tratar
}

function Adicionar_Botoes_De_Apagar_e_Editar(){
	const acoes = document.querySelectorAll('.acoes')

	const botoesEdicao ={
		botaoEditar:document.createElement('button'),
		botaoApagar:document.createElement('button')
	}
	botoesEdicao.botaoEditar.textContent = 'EDITAR'
	botoesEdicao.botaoApagar.textContent = 'APAGAR'
	
	for(let i = 1; i<acoes.length;i++){
		acoes[i].innerHTML=`
			<button class="editar_${i}">EDITAR</button>
			<button class="apagar_${i}">APAGAR</button>
		`
	}
	for(let i = 0; i<botoes.length;i++){
		let botoesEdicao = document.querySelector(`.editar_${i}`)
		let botoesApagar = document.querySelector(`.apagar_${i}`)

		if(botoesEdicao!=null || botoesApagar!=null){
			botoesEdicao.addEventListener('click',botaoClicado=>{
				Habilitar_Edicao(botaoClicado.target)
			})
			botoesApagar.addEventListener('click',botaoClicado=>{
				const nomeDoBotaoClicado = botaoClicado.target.className
				const ID_Do_Botao_Apertado = nomeDoBotaoClicado[nomeDoBotaoClicado.length-1]
				Apagar_Dados(ID_Do_Botao_Apertado)
			})		

		}

	}
}

function Reconhecer_Novos_Valores(ID_Da_Linha_Alterada){
	const linhaAlterada = linhas[ID_Da_Linha_Alterada]
	console.log(linhaAlterada)	
	const camposDaLinhaAlterada = linhaAlterada.children
	console.log(camposDaLinhaAlterada)

	const novosValores = []
	for(let i = 0; i<camposDaLinhaAlterada.length-1;i++){
		const Campos_Dos_Novos_Valores = document.querySelector(`.novoscamposdados_${i}`)//camposDaLinhaAlterada[i].children
		console.log(Campos_Dos_Novos_Valores)
		novosValores.push(Campos_Dos_Novos_Valores.value)

	}
	console.log(novosValores)
	return novosValores

}

function Habilitar_Edicao(Botao_Clicado){
	let idDoBotaoClicado = Botao_Clicado.className[Botao_Clicado.className.length-1]

	let LinhaParente = linhas[idDoBotaoClicado]
	const CamposDoParente = LinhaParente.children
	let valoresAntigos = []
	const novosCampos = []
	const capturarNovosValores = []

	const Botao_Concluido = document.createElement('button')
	Botao_Concluido.textContent = "CONCLUÍDO"
	Botao_Concluido.className = `concluido_${idDoBotaoClicado}`

	const Campos_De_Acoes = document.getElementsByClassName("acoes")

	const Campo_Do_Botao_Clicado = Campos_De_Acoes[idDoBotaoClicado]
	
	const Botao_De_Editar_Atual = document.querySelector(`.${Botao_Clicado.className}`)

	for(let i = 0; i< CamposDoParente.length-1;i++){
		valoresAntigos.push(CamposDoParente[i].textContent)

		const NovosCamposDeDados = document.createElement('input')
		NovosCamposDeDados.className = `novoscamposdados_${i}`
		NovosCamposDeDados.value = valoresAntigos[i]
		CamposDoParente[i].replaceChildren(NovosCamposDeDados)
	}
	
	Botao_De_Editar_Atual.replaceWith(Botao_Concluido)

	Botao_Concluido.addEventListener('click',Botao_Clicado=>{
		alert('DadosAtualizados!')
		idDoBotaoClicado = Botao_Clicado.target.className.length-1

		ID_Da_Linha_Alterada = Botao_Clicado.target.className[idDoBotaoClicado]
		
		const novosValores = Reconhecer_Novos_Valores(ID_Da_Linha_Alterada)
		
		for(let i = 0; i<CamposDoParente.length-1;i++){
			CamposDoParente[i].replaceChildren(novosValores[i])
		}

		const campos = {
			campo_iddalinha:ID_Da_Linha_Alterada,
			campo_fruta:document.querySelector(`.fruta_${ID_Da_Linha_Alterada}`).textContent,
			campo_tipodealimento:document.querySelector(`.tipodealimento_${ID_Da_Linha_Alterada}`).textContent,
			campo_fornecedor:document.querySelector(`.fornecedor_${ID_Da_Linha_Alterada}`).textContent,
			campo_datadevalidade:document.querySelector(`.datadevalidade_${ID_Da_Linha_Alterada}`).textContent,
			campo_preco:document.querySelector(`.preco_${ID_Da_Linha_Alterada}`).textContent,
			campo_estoque:document.querySelector(`.estoque_${ID_Da_Linha_Alterada}`).textContent,
			campo_descricao:document.querySelector(`.descricao_${ID_Da_Linha_Alterada}`).textContent,
			campo_imagem:document.querySelector(`.imagem_${ID_Da_Linha_Alterada}`).src
		}
		console.log(ID_Da_Linha_Alterada)
		console.log(campos)
		
		Editar_Dados(campos)
		const Botao_Enviar = document.createElement('button')
	})
}


async function Renderizar_Dados(){
	const table = document.getElementsByTagName('table')[0]
	const dados = await Buscar_Dados()
	new Promise(renderizacao =>{
		dados.map(dado=>{
				let tr = document.createElement('tr')
				tr.id=dado.id
				
				let tdFruta = document.createElement('td')
				tdFruta.textContent = dado.nome;
				tdFruta.className=`fruta_${dado.id}`

				let tdDataDeValidade = document.createElement('td')			
				tdDataDeValidade.textContent =dado.data_de_validade; 
				tdDataDeValidade.className=`datadevalidade_${dado.id}`

				let tdFornecedor = document.createElement('td')			
				tdFornecedor.textContent = dado.fornecedor;
				tdFornecedor.className=`fornecedor_${dado.id}`
				
				let tdDescricao = document.createElement('td')			
				tdDescricao.textContent = dado.descricao;
				tdDescricao.className=`descricao_${dado.id}`
				
				let tdImagem = document.createElement('img')			
				tdImagem.src = dado.url_imagem;
				tdImagem.className=`imagem_${dado.id}`
							
				let tdTipoDeAlimento = document.createElement('td')			
				tdTipoDeAlimento.textContent = dado.tipo_de_alimento;
				tdTipoDeAlimento.className=`tipodealimento_${dado.id}`
				
				let tdPreco = document.createElement('td')			
				tdPreco.textContent = dado.preco;
				tdPreco.className=`preco_${dado.id}`
				
				let tdEstoque = document.createElement('td')
				tdEstoque.textContent = dado.estoque;
				tdEstoque.className=`estoque_${dado.id}`

				let acoes = document.createElement('td')
				acoes.className = 'acoes'
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
			})		
	})

	Adicionar_Botoes_De_Apagar_e_Editar()	

}

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
	const req = await fetch('http://localhost:6000/editarAlimentos',{
		method:'PUT',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			dadosparaeditar:dados
		})
	})
}
async function Apagar_Dados(Linha_Para_Apagar){
	const req = await fetch(address+servicos.remover,{
		method:'DELETE',
		headers:{'Content-Type':'Application/JSON'},
		body:JSON.stringify({
			linhaParaApagar:Linha_Para_Apagar
		})
	})
}

botoes.enviar.addEventListener('click',()=>{
	console.log(campos.datadevalidade)
	console.log(campos.datadevalidade.value)
	Enviar_Dados(Dados_Fornecidos(),Tipo_De_Alimento_Marcado())
	Renderizar_Dados()
})

Renderizar_Dados() 
Adicionar_Botoes_De_Apagar_e_Editar()