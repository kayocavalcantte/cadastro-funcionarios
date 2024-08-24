// Seleciona os elementos do DOM que serão utilizados
const modal = document.querySelector('.modal-container'); 
const tbody = document.querySelector('tbody'); 
const sNome = document.querySelector('#m-nome'); 
const sFuncao = document.querySelector('#m-funcao'); 
const sSalario = document.querySelector('#m-salario'); 
const btnSalvar = document.querySelector('#btnSalvar'); 
const search = document.querySelector('#search'); 

// Variáveis para armazenar os itens e o ID do item sendo editado
let itens;
let id;

// Adiciona um evento que escuta a digitação no campo de pesquisa
search.oninput = () => {
  loadItens(search.value); // Chama a função loadItens passando o valor da pesquisa
};

// Função para abrir o modal. Se estiver em modo de edição, carrega os dados do item nos campos.
function openModal(edit = false, index = 0) {
  modal.classList.add('active'); 

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
        modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = itens[index].salario;
    id = index; 
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
  }
}

function editItem(index) {
    openModal(true, index);
}

function deleteItem(index) {
  if (confirm("O item será excluído!")) {
    itens.splice(index, 1); 
    setItensBD(); 
    loadItens(); 
  }
}

// Função para inserir um item na tabela (DOM)
function insertItem(item, index) {
  let tr = document.createElement('tr'); 

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr); 
}

// Evento para o botão de salvar
btnSalvar.onclick = e => {
  
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return; 
  }

  e.preventDefault(); 

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].funcao = sFuncao.value;
    itens[id].salario = sSalario.value;
  } else { 
    itens.push({'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value});
  }

  setItensBD(); 
    
  modal.classList.remove('active'); 
  loadItens(); 
  id = undefined; 
}

// Função para carregar os itens do localStorage e exibi-los na tabela
function loadItens(filter = '') {
  itens = getItensBD();

  // Ordena os itens por nome em ordem crescente
  itens.sort((a, b) => a.nome.localeCompare(b.nome));

  // Filtra os itens com base no termo de pesquisa
  const filteredItens = itens.filter(item => 
    item.nome.toLowerCase().includes(filter.toLowerCase()) || 
    item.funcao.toLowerCase().includes(filter.toLowerCase()) || 
    item.salario.toString().includes(filter)
  );

  tbody.innerHTML = ''; 

  filteredItens.forEach((item, index) => {
    insertItem(item, index);
  });
}

// Função para obter os itens do localStorage (ou uma lista vazia, se não houver nada salvo)
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];

// Função para salvar a lista 'itens' no localStorage
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

// Carrega os itens ao iniciar a aplicação
loadItens();
