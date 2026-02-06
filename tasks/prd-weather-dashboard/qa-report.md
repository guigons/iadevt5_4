# Relatório de QA - Weather Dashboard

## Resumo
- **Data:** 2026-02-05
- **Status:** REPROVADO
- **Total de Requisitos:** 24 (RF01-RF24)
- **Requisitos Atendidos:** 20
- **Requisitos com Falha:** 4 (RF01-RF03, RF04 parcial)
- **Bugs Encontrados:** 3

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF01 | Detectar geolocalização automaticamente | PASSOU (parcial) | Geolocalização funciona, mas exibe coordenadas brutas |
| RF02 | Solicitar permissão de geolocalização | PASSOU | Navegador solicita permissão corretamente |
| RF03 | Exibir clima baseado na localização do usuário | FALHOU | Nome da localização exibe coordenadas ao invés de cidade (BUG-01) |
| RF04 | Campo de busca por cidade | PASSOU | Input "Buscar cidade..." presente e funcional |
| RF05 | Buscar clima ao digitar nome da cidade | PASSOU | Busca funciona por botão e Enter |
| RF06 | Exibir resultados da busca | PASSOU (parcial) | Retorna resultado mas "New York" retorna "York" (BUG-03) |
| RF07 | Carregar clima ao selecionar cidade | PASSOU | Dados carregam corretamente após busca |
| RF08 | Exibir temperatura atual | PASSOU | Temperatura exibida em destaque (ex: 22°) |
| RF09 | Exibir sensação térmica | PASSOU | "Sensação 24°" exibido |
| RF10 | Exibir umidade | PASSOU | "Umidade 89%" exibido |
| RF11 | Exibir velocidade do vento | PASSOU | "Vento 8 km/h" exibido |
| RF12 | Exibir condição climática em texto | PASSOU | "Parcialmente nublado", "Chuva leve", "Céu limpo", "Tempestade" |
| RF13 | Exibir ícone do clima | PASSOU | Ícones Lucide React renderizados corretamente |
| RF14 | Exibir nome da localização | PASSOU | "São Paulo, Brasil", "Londres, Reino Unido", "Tóquio, Japão" |
| RF15 | Exibir previsão horária de 24h | PASSOU | 24 entradas horárias exibidas |
| RF16 | Scroll horizontal na previsão horária | PASSOU | scrollWidth (1808) > clientWidth (638), scroll funcional |
| RF17 | Exibir hora, ícone e temperatura por hora | PASSOU | Cada slot mostra hora, ícone e temperatura |
| RF18 | Exibir previsão de 7 dias | PASSOU | 7 dias exibidos com nomes dos dias da semana |
| RF19 | Exibir min/max por dia | PASSOU | Temperaturas mínima e máxima por dia |
| RF20 | Destacar dia atual | PASSOU | "Hoje" destacado com fundo diferenciado |
| RF21 | Endpoint GET /api/weather/forecast | PASSOU | Retorna 200 OK com dados completos |
| RF22 | Endpoint aceita latitude/longitude | PASSOU | Coordenadas processadas corretamente |
| RF23 | Endpoint aceita city como parâmetro | PASSOU | Busca por cidade funcional |
| RF24 | Endpoint GET /api/weather/geocoding | N/T | Não testado diretamente (usado internamente) |

## Testes E2E Executados

| Fluxo | Resultado | Observações |
|-------|-----------|-------------|
| Carregamento inicial com geolocalização | FALHOU | Dados carregam, mas localização mostra coordenadas brutas (BUG-01) |
| Busca por cidade válida (São Paulo) | PASSOU | "São Paulo, Brasil" com todos os dados corretos |
| Busca por cidade válida (London) | PASSOU | "Londres, Reino Unido" - tradução correta |
| Busca por cidade válida (Tokyo) | PASSOU | "Tóquio, Japão" com gradiente adaptivo |
| Busca por cidade inválida | PASSOU | "Cidade não encontrada. Tente outro nome." |
| Busca por Enter key | PASSOU | Submit funciona via Enter no input |
| Busca por Tab + Enter no botão | PASSOU | Navegação por teclado funcional |
| Múltiplas buscas consecutivas | PASSOU | Dados atualizam corretamente a cada busca |
| Busca "New York" | FALHOU | Retorna "York, EUA" ao invés de "New York" (BUG-03) |
| Scroll horizontal previsão horária | PASSOU | Scroll suave com indicador visual |
| Previsão 7 dias com destaque "Hoje" | PASSOU | Dia atual destacado |
| Gradiente adaptivo por condição | PASSOU | Azul (nublado), laranja (céu limpo), roxo (tempestade) |
| Responsividade desktop (1280x720) | PASSOU | Layout adequado, centralizado |
| Responsividade tablet (768x1024) | PASSOU | Layout adapta corretamente |
| Responsividade mobile (375x667) | FALHOU | Pills de Sensação/Umidade/Vento overflow (BUG-02) |

## Acessibilidade

- [x] Navegação por teclado funciona (Tab entre input e botão, Enter para submit)
- [x] Elementos interativos têm labels descritivos (input com placeholder, button com texto)
- [x] SVGs têm atributos aria adequados (36 SVGs sem issues)
- [x] Estrutura semântica de headings (H2 para localização, H3 para seções)
- [x] Formulário envolto em elemento `<form>`
- [ ] Input usa placeholder como label (deveria ter `aria-label` ou `<label>` dedicado - menor)
- [x] Mensagem de erro clara e acessível ("Cidade não encontrada. Tente outro nome.")
- [x] Botão desabilitado quando input vazio (previne submissão vazia)

## Bugs Encontrados

| ID | Descrição | Severidade | Screenshot |
|----|-----------|------------|------------|
| BUG-01 | Geolocalização exibe coordenadas brutas (-27.58..., -48.54...) ao invés do nome da cidade | Alta | qa-02-bug-raw-coordinates.png |
| BUG-02 | Pills de Sensação/Umidade/Vento overflow horizontalmente em mobile (375px) | Média | qa-11-mobile-overflow-bug.png |
| BUG-03 | Busca "New York" retorna "York, EUA" (cidade errada no Nebraska) | Média | qa-12-bug-york-instead-newyork.png |

## Pontos Positivos

1. **Design visual excelente** - Gradientes adaptativos por condição climática funcionam muito bem (azul, laranja, roxo)
2. **Glassmorphism** - Cards com efeito glass (backdrop-blur) bem implementados
3. **Ícones coerentes** - Ícones Lucide React mapeados corretamente para cada condição WMO
4. **Tradução** - Nomes de cidades e condições climáticas traduzidos para português
5. **Previsão horária** - 24 horas com scroll horizontal fluido e indicador visual
6. **Previsão 7 dias** - Layout limpo com barra de temperatura min/max com gradiente de cores
7. **Tratamento de erro** - Mensagem clara para cidade não encontrada
8. **Performance** - Dados carregam rapidamente (< 3 segundos)

## Conclusão

O Weather Dashboard está **REPROVADO** nesta rodada de QA devido a 3 bugs identificados:

- **BUG-01 (Alta):** É o mais crítico pois afeta a experiência do primeiro acesso. O usuário vê coordenadas brutas ao invés do nome da cidade quando usa geolocalização. Requer implementação de reverse geocoding no backend.
- **BUG-02 (Média):** Afeta a experiência mobile. As pills de detalhes do clima ultrapassam os limites da tela em dispositivos de 375px.
- **BUG-03 (Média):** A geocodificação retorna cidades incorretas para buscas como "New York". O algoritmo de seleção de resultado precisa ser melhorado.

**Recomendação:** Corrigir os 3 bugs (priorizar BUG-01) e executar nova rodada de QA.
