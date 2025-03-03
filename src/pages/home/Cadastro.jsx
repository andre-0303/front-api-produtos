import React, { useState, useEffect, useRef } from "react";
import "./Cadastro.css";
import Trash from "../../assets/delete.png";
import api from "../../services/api";

const Cadastro = () => {
  // Usando useState para armazenar os produtos
  const [produtos, setProdutos] = useState([]);

  const inputName = useRef();
  const inputPrice = useRef();
  const inputStatus = useRef();

  async function getProducts() {
    try {
      // Fazendo a requisição para a API
      const response = await api.get("/produtos");

      // Atualizando o estado com a lista de produtos
      setProdutos(response.data); // Supondo que a resposta seja algo como { data: [...] }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  async function createProducts(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    try {
      // Enviando a requisição POST para criar um novo produto
      const response = await api.post("/produtos", {
        name: inputName.current.value,
        price: inputPrice.current.value,
        status: inputStatus.current.value,
      });

      // Após a criação do produto, atualizamos o estado dos produtos
      setProdutos([...produtos, response.data]); // Adiciona o novo produto à lista existente

      // Limpa os inputs após o cadastro
      inputName.current.value = '';
      inputPrice.current.value = '';
      inputStatus.current.value = '';

    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  }

  async function deleteProducts(id) {
    console.log('ID do produto a ser excluído:', id); // Verifique se o ID está correto aqui
    try {
      // Deleta o produto no servidor
      await api.delete(`/produtos/${id}`);

      // Atualiza a lista de produtos localmente, removendo o produto deletado
      setProdutos(produtos.filter((produto) => produto.id !== id));

      // Exibe o alerta de sucesso
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir o produto. Tente novamente.");
    }
  }

  useEffect(() => {
    getProducts();
  }, []); // A dependência vazia [] faz a chamada apenas uma vez, após o primeiro render

  return (
    <>
      <div className="container">
        <form>
          <h1>Cadastro de produtos</h1>
          <input
            name="name"
            type="text"
            placeholder="Digite o nome do produto"
            ref={inputName}
          />
          <input
            name="price"
            type="number"
            placeholder="Digite o preço do produto"
            ref={inputPrice}
          />
          <input
            name="status"
            type="text"
            placeholder="Digite o status do produto"
            ref={inputStatus}
          />
          <button type="submit" onClick={createProducts}>
            Cadastrar
          </button>
        </form>

        <div className="card-container">
          {produtos.map((produto) => (
            <div key={produto.id} className="card">
              <div>
                <p>
                  Nome: <span>{produto.name}</span>
                </p>
                <p>
                  Preço: <span>{produto.price}</span>
                </p>
                <p>
                  Status: <span>{produto.status}</span>
                </p>
              </div>
              <button onClick={() => deleteProducts(produto.id)}>
                <img src={Trash} alt="Deletar" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cadastro;
