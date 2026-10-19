# TechStore — refatoracao SOLID simplificada

Projeto mantido proximo ao original: JavaScript CommonJS (`require`, `module.exports`), sem framework, sem Factory e sem classes extras para cada tipo de pagamento.

## Executar

```bash
npm start
npm test
```

Nao exige `npm install`, pois utiliza apenas Node.js (20+).

## Como ler (em ordem)

1. `src/index.js`: cria pedido e conecta dependencias.
2. `src/services/OrderService.js`: coordena as etapas.
3. `src/services/OrderValidator.js`: valida cliente, itens e estoque.
4. `src/services/DiscountService.js`: regras de desconto.
5. `src/services/FreightService.js`: tabela de fretes.
6. `src/services/PaymentService.js`: pagamentos configurados em um objeto.
7. `src/repositories/`: dados de produtos e pedidos em memoria.

## SOLID aplicado

- **S (SRP)**: cada service tem funcao propria; OrderService coordena o fluxo. O resumo e a exibicao ainda estao nele por simplicidade (o SRP nao e aplicado perfeitamente).
- **O (OCP)**: taxas de clientes, cupons, regiao de entrega e formas de pagamento ficam em tabelas/registro de regras. Adicionar uma nova regra pode exigir configurar a tabela, mas nao reescrever o fluxo principal.
- **L (LSP)**: sem hierarquia de heranca desnecessaria; os pagamentos seguem o mesmo contrato de retorno `{status, fee, discount}`.
- **I (ISP)**: dependencias pequenas, cada uma com operacoes necessarias. JS nao exige interfaces formais.
- **D (DIP)**: as dependencias sao recebidas no construtor de OrderService; index.js monta as implementacoes. Os testes usam dublês para notificacoes e logger.
- **Demeter**: `customer.getShippingRegion()` e `customer.getShippingAddress()` evitam acesso encadeado ao endereco na logica de frete e pedido.

## Observacoes

- Nao ha integracao real de pagamento, envio de e-mail ou banco de dados; o comportamento e simulado como no exercicio original.
- O ZIP original nao trazia `NotificationService.js`; foi criado um simulador de notificacao por console.
- Atualizacoes de estoque e salvamento sao em memoria, portanto nao ha transacao atomica entre eles.
- O relatorio anterior descreve uma arquitetura mais detalhada e **nao deve ser entregue como se descrevesse esta versao**.
