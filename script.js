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

05-11-2024
ADICIONAR O MALDITO ID DO DADO NOS BOTOES EDITAR E APAGAR POR MEIO DO ID DA LINHA CORRESPONDENTE.
ISSO PRECISA SER FEITO NO MUTATIONOBSERVER

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
/*
TODO:

QUASE 100% PRONTO, FALTA RESOLVER O PROBLEMA DA PAGINA RENDERIZAR 
AO ENVIAR OS DADOS, EDITAR E APAGAR

TAMBÉM PRECISA IMPLEMENTAR UM CAMPO DE INPUT NA IMAGEM PARA ELA NAO FICAR QUEBRADA AO EDITAR






*/

const address = "http://localhost:8000"
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
	const targetNode = document;
	const config = { childList: true, subtree: true };
	const callback = function(mutationsList, observer) {

		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				const addedNodes = mutation.addedNodes;
				for (const node of addedNodes) {
					for(let i = 0; i < 0+acoes.length; i++){

						switch (node) {
							case linhas[i]:
								const Linha = node
								const idDaLinha = parseInt(Linha.id)
								console.log(idDaLinha)

								const caixasDeAcoes = Linha.lastChild 
									console.log(`LINHA Nº: ${i}`)
									console.log(Linha)
									console.log(caixasDeAcoes)
								const botaoEditar = document.createElement('button')
									botaoEditar.textContent= `EDITAR`
									botaoEditar.className= `editar_${idDaLinha}`

								const botaoApagar = document.createElement('button')
									botaoApagar.textContent= `APAGAR`
									botaoApagar.className= `apagar_${idDaLinha}`
								
								caixasDeAcoes.appendChild(botaoEditar)
								caixasDeAcoes.appendChild(botaoApagar)

								botaoEditar.addEventListener('click',Botao_Clicado =>{
										//alert('oi')
										const classeDoBotao = Botao_Clicado.target.className

									if(classeDoBotao.length > 8){
										const idDoBotaoClicado = classeDoBotao.slice(-2)
										console.log(idDoBotaoClicado)
										Habilitar_Edicao(Botao_Clicado.target)
									}
									else{
										Habilitar_Edicao(Botao_Clicado.target)

									}
								})

								botaoApagar.addEventListener('click',Botao_Clicado =>{
									alert('oi')
									const caixaDeAcaoParente = Botao_Clicado.target.parentElement
									const LinhaParente = caixaDeAcaoParente.parentElement
									const idDaLinhaParente = parseInt(LinhaParente.id)
									console.log(Botao_Clicado)
									console.log(caixaDeAcaoParente)
									console.log(LinhaParente)
									console.log(idDaLinhaParente)

									Apagar_Dados(idDaLinhaParente)
								})															
							}
					}
				}
			}
		}
	};

	const observer = new MutationObserver(callback);
	observer.observe(targetNode, config);
}




function Reconhecer_Novos_Valores(ID_Da_Linha_Alterada){
	const linhaAlterada = document.getElementById(`${ID_Da_Linha_Alterada}`) //linhas[ID_Da_Linha_Alterada]
	console.log(linhaAlterada)	
	const camposDaLinhaAlterada = linhaAlterada.children
	console.log(camposDaLinhaAlterada)

	const novosValores = []

	// ESTE TRECHO  ABAIXO VISTORIA OS CAMPOS DE INPUT COM A CLASSE .novoscamposdados_ID 
	// DEPOIS EMPURRA OS VALORES ADICIONADOS AOS INPUTS NO ARRAY novosValores
	// SOMENTE OS TEXTOS SÃO ADICIONADOS AO ARRAY 	
	for(let i = 0; i<camposDaLinhaAlterada.length-1;i++){
		const Campos_Dos_Novos_Valores = document.querySelector(`.novoscamposdados_${i}`)//camposDaLinhaAlterada[i].children
			console.log('ELEMENTOS INPUT QUE TERÃO SEUS VALORES RECONHECIDOS')
			console.log(Campos_Dos_Novos_Valores)

		novosValores.push(Campos_Dos_Novos_Valores.value)

	}
	console.log(novosValores)
	return novosValores

}

function Habilitar_Edicao(Botao_Clicado){
	console.log('BOTÃO CLICADO')
		console.log(Botao_Clicado)

	const classeDoBotao = Botao_Clicado.className
		console.log('CLASSE DO BOTÃO')
		console.log(classeDoBotao)
	
	let idDoBotaoClicado = classeDoBotao[Botao_Clicado.className.length-1]

	const caixaDeAcaoParente = Botao_Clicado.parentElement
		console.log('caixaDeAcaoParente')
		console.log(caixaDeAcaoParente)
	
	const LinhaParente = caixaDeAcaoParente.parentElement
		console.log('LinhaParente')
		console.log(LinhaParente)
	const idDaLinhaParente = parseInt(LinhaParente.id)
		console.log('idDaLinhaParente')
		console.log(idDaLinhaParente)


	if(classeDoBotao.length > 8){
		console.log('A CLASSE DO BOTÃO TEM MAIS DE 8 CARACTERES')
		idDoBotaoClicado = classeDoBotao.substring(7,classeDoBotao.length)
			console.log('ID DO BOTÃO RECORTADO CORRETAMENTE!')
			console.log(idDoBotaoClicado)
	}
	
	const CamposDoParente = LinhaParente.children

	let valoresAntigos = []
	const novosCampos = []
	const capturarNovosValores = []

	const Botao_Concluido = document.createElement('button')
		Botao_Concluido.textContent = "CONCLUÍDO"
		Botao_Concluido.className = `concluido_${idDoBotaoClicado}`
	
	const Botao_De_Editar_Atual = document.querySelector(`.${Botao_Clicado.className}`)

	/* AQUI SERÃO REMOVIDOS OS TEXTOS NODE  DOS TDS DA LINHA PRENTE DO BOTÃO CLICADO */
	console.log('QUANTIDADE DE FILHOS DA LINHA CLICADA')
	console.log(CamposDoParente.length)
	console.log(CamposDoParente)

	for(let i = 0; i< CamposDoParente.length-1;i++){

		valoresAntigos.push(CamposDoParente[i].textContent) // ARMAZENAMENTO DOS VALORES ANTES DA SUBSTITUIÇÃO
		
		const NovosCamposDeDados = document.createElement('input') //DEFINIÇÃO DOS NOVOS INPUTS
			NovosCamposDeDados.className = `novoscamposdados_${i}`
			NovosCamposDeDados.value = valoresAntigos[i]

		switch (CamposDoParente[i]){
			case document.querySelector(`.tdimagem_${idDaLinhaParente}`):
				const campoDeImagem = CamposDoParente[i].firstChild.src
				//alert(campoDeImagem)
				NovosCamposDeDados.value=campoDeImagem
				// statements_1
				break;
			default:
				// statements_def
				break;
		}
		
		CamposDoParente[i].replaceChildren(NovosCamposDeDados) // SUBSTITUIÇÃO
	}
	
	Botao_De_Editar_Atual.replaceWith(Botao_Concluido)







	Botao_Concluido.addEventListener('click',Botao_Clicado=>{
		alert('DadosAtualizados!')
		const classeDoBotao = Botao_Clicado.target.className
		if(classeDoBotao.length > 8){
			console.log(classeDoBotao)
		}		
		ID_Da_Linha_Alterada = idDoBotaoClicado
			console.log(ID_Da_Linha_Alterada)		

		const novosValores = Reconhecer_Novos_Valores(ID_Da_Linha_Alterada)
			console.log('VALORES QUE RETORNARAM DA FUNÇÃO Reconhecer_Novos_Valores:')
			console.log(novosValores)

	


		// OS NOVOS VALORES SERÃO REPASSADOS AOS TDS DA LINHA PARENTE
		// NO CASO, SOMENTE OS TEXTOS.
		// ISSO PROVAVELMENTE VAI ME GERAR UMA BOA DOR DE CABEÇA POR CAUSA QUE A IMAGEM NÃO VAI RECEBER SEU SRC
		for(let i = 0; i<CamposDoParente.length-1;i++){
			//console.log(CamposDoParente[i])
			CamposDoParente[i].replaceChildren(novosValores[i])
			//console.log(CamposDoParente[i])

			switch (CamposDoParente[i]) {
				case document.querySelector(`.tdimagem_${ID_Da_Linha_Alterada}`):
					//alert('message?: DOMString')
					//console.log(CamposDoParente[i])
				 	const novaImagem = document.createElement('img')
				 		novaImagem.className = `imagem_${ID_Da_Linha_Alterada}`
				 		novaImagem.src = novosValores[novosValores.length-1]
				 	CamposDoParente[i].replaceChildren(novaImagem)

					// statements_1
					break;
				default:
					// statements_def
					break;
			}
		}



		const campos = {
			campo_iddalinha:ID_Da_Linha_Alterada,
			campo_fruta:document.querySelector(`.fruta_${ID_Da_Linha_Alterada}`).textContent,
			campo_tipodealimento:document.querySelector(`.tipodealimento_${ID_Da_Linha_Alterada}`).textContent,
			campo_fornecedor:document.querySelector(`.fornecedor_${ID_Da_Linha_Alterada}`).textContent,
			campo_datadevalidade:document.querySelector(`.datadevalidade_${ID_Da_Linha_Alterada}`).textContent,
			campo_preco:document.querySelector(`.preco_${ID_Da_Linha_Alterada}`).textContent.substring(3,document.querySelector(`.preco_${ID_Da_Linha_Alterada}`).textContent.length),
			campo_estoque:document.querySelector(`.estoque_${ID_Da_Linha_Alterada}`).textContent,
			campo_descricao:document.querySelector(`.descricao_${ID_Da_Linha_Alterada}`).textContent,
			campo_imagem:document.querySelector(`.imagem_${ID_Da_Linha_Alterada}`).src // ESSE ELEMENTO AQUI NÃO EXISTE APÓS A RESUBSTIUIÇÃO. POR ISSO ESSA CARNIÇA NÃO TA ENVIANDO
		}
		console.log(ID_Da_Linha_Alterada)
		console.log(campos)
		
		Editar_Dados(campos)
		
		const Botao_Enviar = document.createElement('button')

		//location.reload()
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

				const tratamentoDaDataDeValidade = () => {
					let dataDeValidade = []
					for (let i = 0; i <10; i++){
						dataDeValidade.push(dado.data_de_validade[i])

					}
					
					return dataDeValidade.join('')
				}

				let tdDataDeValidade = document.createElement('td')			
				tdDataDeValidade.textContent = tratamentoDaDataDeValidade(); 
				tdDataDeValidade.className=`datadevalidade_${dado.id}`

				let tdFornecedor = document.createElement('td')			
				tdFornecedor.textContent = dado.fornecedor;
				tdFornecedor.className=`fornecedor_${dado.id}`
				
				let tdDescricao = document.createElement('td')			
				tdDescricao.textContent = dado.descricao;
				tdDescricao.className=`descricao_${dado.id}`
				

				let imagem = document.createElement('img')			
				imagem.src = dado.url_imagem;
				imagem.className=`url_imagem_${dado.id}`

				let tdImagem = document.createElement('td')			
				tdImagem.className=`tdimagem_${dado.id}`

				let tdTipoDeAlimento = document.createElement('td')			
				tdTipoDeAlimento.textContent = dado.tipo_de_alimento.toUpperCase();
				tdTipoDeAlimento.className=`tipodealimento_${dado.id}`
				
				let tdPreco = document.createElement('td')			
				tdPreco.textContent = "R$ " + dado.preco;
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
				tdImagem.appendChild(imagem)
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
	const req = await fetch(address+servicos.editar,{
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
//	location.reload()
})

Renderizar_Dados() 
Adicionar_Botoes_De_Apagar_e_Editar()