# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

Este PRD define um painel de monitoramento de clima para usuários que desejam consultar condições atuais e previsão por cidade ou geolocalização. O produto resolve o problema de acesso rápido e confiável a informações meteorológicas essenciais em uma interface única, responsiva e amigável.

A funcionalidade atende principalmente usuários finais que precisam planejar deslocamentos e atividades diárias com base em temperatura, chuva e índice UV. O valor de negócio está em oferecer uma experiência completa de consulta climática com boa usabilidade, reduzindo fricção na busca e aumentando engajamento recorrente.

## Objetivos

- Disponibilizar, em uma única tela, clima atual, previsão hora a hora e previsão de 7 dias para uma cidade pesquisada.
- Garantir que 100% das consultas do frontend sejam feitas via backend próprio, sem acesso direto à API externa no cliente.
- Permitir descoberta de coordenadas por nome de cidade via backend para suportar buscas textuais e por geolocalização.
- Fornecer feedback claro de carregamento, erro e cidade não encontrada para reduzir abandono durante busca.
- Entregar experiência responsiva (mobile-first) com indicadores visuais que facilitem interpretação rápida dos dados.

Métricas principais:
- Taxa de sucesso de busca por cidade (HTTP 200 sobre total de tentativas válidas).
- Tempo de resposta percebido da busca (início do loading até renderização completa).
- Taxa de uso da busca por geolocalização.
- Taxa de retry após erro e sucesso subsequente.

## Histórias de Usuário

- Como usuário mobile, eu quero buscar o clima por nome da cidade para que eu possa planejar meu dia rapidamente.
- Como usuário em deslocamento, eu quero usar minha localização atual para obter o clima local sem digitar a cidade.
- Como usuário que compara horários, eu quero visualizar previsão hora a hora de temperatura e precipitação para decidir melhor quando sair.
- Como usuário que planeja a semana, eu quero ver previsão de 7 dias com mínima, máxima e precipitação para organizar atividades futuras.
- Como usuário em conexão instável, eu quero ver estado de carregamento e mensagens de erro com opção de tentar novamente para não ficar sem orientação.

Personas:
- Primária: pessoa usuária geral (mobile-first), com necessidade de consulta rápida de clima.
- Secundária: usuário que depende de planejamento semanal (trabalho externo, lazer, deslocamentos).

Fluxos principais:
- Busca por cidade digitada e exibição do painel completo.
- Busca por geolocalização e exibição do painel completo.
- Fluxo de erro com retry até sucesso ou nova consulta.

Casos extremos:
- Cidade inexistente ou ambígua sem resultado válido.
- API externa indisponível temporariamente.
- Mudança rápida de consultas consecutivas.

## Funcionalidades Principais

1. Busca de clima por cidade
   - O que faz: recebe cidade digitada e retorna dados climáticos consolidados.
   - Por que é importante: é o fluxo principal de descoberta de informação.
   - Como funciona em alto nível: frontend envia cidade ao backend, backend converte cidade em coordenadas e consulta previsão.

2. Busca por geolocalização
   - O que faz: permite obter clima com base na localização atual do usuário.
   - Por que é importante: reduz atrito de digitação e melhora velocidade de uso.
   - Como funciona em alto nível: frontend obtém coordenadas do dispositivo e usa backend para retornar o mesmo payload climático.

3. Exibição de clima atual
   - O que faz: apresenta temperatura, umidade, vento, UV e precipitação atuais.
   - Por que é importante: entrega leitura imediata das condições presentes.
   - Como funciona em alto nível: dados atuais são apresentados em cards com ênfase visual por condição.

4. Previsão hora a hora
   - O que faz: mostra temperatura e precipitação por hora em gráfico interativo.
   - Por que é importante: apoia decisões de curto prazo no mesmo dia.
   - Como funciona em alto nível: série temporal horária é transformada em visualização interativa no frontend.

5. Previsão de 7 dias
   - O que faz: apresenta mínima, máxima e precipitação diária em cards.
   - Por que é importante: oferece planejamento de médio prazo.
   - Como funciona em alto nível: dados diários são exibidos com barras visuais de faixa térmica.

6. Estados de interface (loading, erro e vazio)
   - O que faz: exibe skeleton loading, erro com retry e mensagem amigável para cidade não encontrada.
   - Por que é importante: melhora confiança e reduz frustração do usuário.
   - Como funciona em alto nível: frontend alterna estados conforme retorno do backend.

Requisitos funcionais numerados:
- RF-01: O sistema deve permitir busca por cidade sem autocomplete.
- RF-02: O backend deve expor GET /api/weather?city=<cidade>.
- RF-03: O backend deve validar ausência de cidade e retornar 400 quando aplicável.
- RF-04: O backend deve retornar 404 quando a cidade não for encontrada.
- RF-05: O backend deve consultar API de geocoding para converter cidade em coordenadas.
- RF-06: O backend deve consultar API de forecast com as coordenadas obtidas.
- RF-07: O frontend deve consumir exclusivamente a API do backend para dados climáticos.
- RF-08: O frontend deve exibir clima atual com temperatura, umidade, vento, UV e precipitação.
- RF-09: O frontend deve exibir previsão hora a hora de temperatura e precipitação em gráfico interativo.
- RF-10: O frontend deve exibir previsão dos próximos 7 dias com mínima, máxima e precipitação.
- RF-11: O frontend deve disponibilizar botão de geolocalização para consulta local.
- RF-12: O frontend deve exibir feedback visual de carregamento durante busca.
- RF-13: O frontend deve exibir skeleton loading enquanto dados são carregados.
- RF-14: O frontend deve exibir erro com opção de retry quando houver falha de consulta.
- RF-15: O frontend deve exibir mensagem amigável quando cidade não for encontrada.
- RF-16: O frontend deve aplicar paleta dinâmica de cores baseada na condição climática atual.
- RF-17: O frontend deve exibir barra visual de índice UV com gradiente de verde a vermelho.
- RF-18: O frontend deve ser responsivo com abordagem mobile-first.

## Experiência do Usuário

A experiência prioriza consulta rápida e compreensão visual imediata em dispositivos móveis.

Jornada principal:
- Usuário acessa o painel e digita uma cidade ou usa geolocalização.
- Sistema apresenta loading visual durante consulta.
- Painel exibe clima atual, gráfico hora a hora e cards de 7 dias.
- Em caso de erro, sistema exibe mensagem e botão de tentativa novamente.

Requisitos de UI/UX:
- Layout responsivo mobile-first.
- Cards informativos com hierarquia visual clara.
- Gráfico hora a hora com leitura fácil em telas pequenas.
- Cores dinâmicas por condição climática para reforçar contexto.
- Feedback explícito para loading, erro e ausência de resultado.

Requisitos de acessibilidade:
- Contraste adequado entre texto e fundo em todos os estados visuais.
- Componentes interativos acessíveis por teclado.
- Mensagens de erro e status com texto claro e compreensível.
- Rótulos perceptíveis para campo de cidade e botão de geolocalização.

## Restrições Técnicas de Alto Nível

- Frontend e backend devem ser implementados nos projetos existentes em `./frontend` e `./backend`.
- A integração de dados climáticos deve ocorrer exclusivamente via backend próprio.
- O backend depende de dois serviços externos: Geocoding API e Weather API do Open-Meteo.
- O endpoint principal do backend deve seguir o contrato `GET /api/weather?city=<cidade>` com status 200, 400 e 404.
- O payload de sucesso deve manter compatibilidade com o retorno da Open-Meteo para reduzir ambiguidade de dados.
- Deve existir validação de endpoint por testes de chamada HTTP (incluindo cURL) para serviços externos e backend.

Premissas e dependências:
- Disponibilidade dos endpoints Open-Meteo para geocoding e forecast.
- Permissão de geolocalização concedida pelo usuário para fluxo local.
- Conectividade de rede para comunicação frontend-backend e backend-Open-Meteo.

## Fora de Escopo

- Implementação de tema claro/escuro.
- Qualquer tipo de animação de interface.
- Consumo direto da API Open-Meteo pelo frontend.
- Alterações além do painel de clima e seu fluxo de busca/visualização.
- Estratégias avançadas de personalização de cidade favorita, alertas e notificações.
