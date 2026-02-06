# Tarefa 4.0: Toggle de Unidade de Temperatura (Celsius/Fahrenheit)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar um botão toggle visível no Weather Dashboard que permita ao usuário alternar a exibição de temperaturas entre Celsius (°C) e Fahrenheit (°F). A preferência do usuário deve ser persistida em localStorage. Todas as temperaturas exibidas nos componentes `CurrentWeather`, `HourlyForecast` e `DailyForecast` devem respeitar a unidade selecionada.

**Importante:** Não é necessário alterar o backend. A API Open-Meteo já retorna valores em Celsius e a conversão será feita inteiramente no frontend.

<requirements>
- Botão toggle visível no dashboard para alternar entre °C e °F
- Todas as temperaturas devem ser convertidas corretamente ao trocar a unidade
- A preferência deve ser persistida em localStorage e restaurada ao recarregar a página
- O padrão inicial (sem preferência salva) deve ser Celsius
- A conversão deve usar a fórmula: F = (C × 9/5) + 32
</requirements>

## Subtarefas

- [ ] 4.1 Criar funções utilitárias de conversão de temperatura em `weather.utils.ts`
- [ ] 4.2 Atualizar a função `formatTemperature()` para receber a unidade e exibir o sufixo correto (°C ou °F)
- [ ] 4.3 Criar o `TemperatureUnitContext` com Provider e hook `useTemperatureUnit` para gerenciar o estado da unidade selecionada
- [ ] 4.4 Adicionar persistência em localStorage dentro do context (ler ao montar, salvar ao trocar)
- [ ] 4.5 Criar o componente de botão toggle (ex: `TemperatureToggle.tsx`) com estilo glassmórfico consistente com o dashboard
- [ ] 4.6 Posicionar o botão toggle no `WeatherDashboard.tsx`, próximo à barra de busca, em local visível
- [ ] 4.7 Integrar o context no `CurrentWeather.tsx` — converter temperatura atual e sensação térmica
- [ ] 4.8 Integrar o context no `HourlyForecast.tsx` — converter temperaturas horárias
- [ ] 4.9 Integrar o context no `DailyForecast.tsx` — converter temperaturas mínima e máxima
- [ ] 4.10 Criar testes unitários para as funções de conversão e formatação
- [ ] 4.11 Criar testes unitários para o context (estado inicial, toggle, persistência em localStorage)
- [ ] 4.12 Criar testes de integração para os componentes renderizando temperaturas em ambas as unidades
- [ ] 4.13 Criar testes E2E com Playwright validando o toggle, a conversão visual e a persistência entre recarregamentos

## Detalhes de Implementação

Consulte o `techspec.md` para padrões de arquitetura e decisões técnicas do projeto.

### Funções de Conversão (`weather.utils.ts`)

Criar duas funções puras:
- `convertCelsiusToFahrenheit(celsius: number): number` — aplica `(celsius * 9/5) + 32` e arredonda com `Math.round`
- `convertTemperature(celsius: number, unit: TemperatureUnit): number` — retorna o valor original se `unit === "celsius"`, ou converte se `unit === "fahrenheit"`

Atualizar `formatTemperature` para aceitar a unidade:
```typescript
type TemperatureUnit = "celsius" | "fahrenheit";

function formatTemperature(temperature: number, unit: TemperatureUnit): string {
  const converted = convertTemperature(temperature, unit);
  const suffix = unit === "celsius" ? "°C" : "°F";
  return `${Math.round(converted)}${suffix}`;
}
```

### Context API (`temperature-unit-context.tsx`)

Criar um novo arquivo `frontend/src/components/weather/temperature-unit-context.tsx` com:
- Tipo `TemperatureUnit = "celsius" | "fahrenheit"`
- `TemperatureUnitContext` com `createContext`
- `TemperatureUnitProvider` que gerencia o estado e lê/salva em `localStorage` com a chave `"temperatureUnit"`
- Hook `useTemperatureUnit()` que retorna `{ unit, toggleUnit }`

Envolver o conteúdo do `WeatherDashboard.tsx` com o `TemperatureUnitProvider`.

### Botão Toggle (`TemperatureToggle.tsx`)

Criar um novo arquivo `frontend/src/components/weather/TemperatureToggle.tsx`:
- Dois botões lado a lado: "°C" e "°F"
- O botão ativo deve ter destaque visual (fundo mais claro/opaco)
- Estilo glassmórfico consistente com o restante do dashboard (`backdrop-blur`, bordas translúcidas)
- Usar o hook `useTemperatureUnit()` para ler e alternar a unidade
- Posicionar no `WeatherDashboard.tsx` próximo ao `WeatherSearch`, no topo da página

### Integração nos Componentes

Em cada componente que exibe temperatura:
1. Importar e usar o hook `useTemperatureUnit()`
2. Passar `unit` para `formatTemperature(temperature, unit)` em todas as chamadas
3. Componentes afetados:
   - `CurrentWeather.tsx` — temperatura principal e sensação térmica
   - `HourlyForecast.tsx` — temperatura de cada hora
   - `DailyForecast.tsx` — temperaturas mínima e máxima de cada dia

## Critérios de Sucesso

- O botão toggle é visível e acessível no dashboard sem scroll
- Clicar no toggle alterna imediatamente todas as temperaturas exibidas
- A conversão é matematicamente correta (ex: 20°C = 68°F, 0°C = 32°F, 100°C = 212°F)
- Ao recarregar a página, a unidade previamente selecionada é restaurada do localStorage
- O estilo do botão é consistente com o design glassmórfico do dashboard
- Todos os testes passam com sucesso
- Tipagem TypeScript correta sem uso de `any`

## Testes da Tarefa

- [ ] Testes de unidade para `convertCelsiusToFahrenheit` (valores positivos, negativos, zero, decimais)
- [ ] Testes de unidade para `convertTemperature` (ambas as unidades)
- [ ] Testes de unidade para `formatTemperature` atualizado (sufixo °C e °F)
- [ ] Testes de unidade para `TemperatureUnitContext` (estado inicial celsius, toggle alterna, leitura de localStorage)
- [ ] Testes de integração para `CurrentWeather` renderizando em °C e °F
- [ ] Testes de integração para `HourlyForecast` renderizando em °C e °F
- [ ] Testes de integração para `DailyForecast` renderizando em °C e °F
- [ ] Testes de integração para `TemperatureToggle` (clique alterna unidade, estilo ativo correto)
- [ ] Testes E2E: toggle alterna todas as temperaturas visíveis na página
- [ ] Testes E2E: recarregar a página mantém a unidade selecionada

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

### Arquivos a criar
- `frontend/src/components/weather/temperature-unit-context.tsx`
- `frontend/src/components/weather/TemperatureToggle.tsx`
- `frontend/src/components/weather/__tests__/temperature-unit-context.test.tsx` (ou similar)
- `frontend/src/components/weather/__tests__/TemperatureToggle.test.tsx` (ou similar)
- `e2e/temperature-toggle.spec.ts` (ou similar)

### Arquivos a modificar
- `frontend/src/components/weather/weather.utils.ts` — adicionar funções de conversão, atualizar `formatTemperature`
- `frontend/src/components/weather/weather.types.ts` — adicionar tipo `TemperatureUnit`
- `frontend/src/components/weather/WeatherDashboard.tsx` — envolver com Provider, posicionar toggle
- `frontend/src/components/weather/CurrentWeather.tsx` — usar context para formatar temperaturas
- `frontend/src/components/weather/HourlyForecast.tsx` — usar context para formatar temperaturas
- `frontend/src/components/weather/DailyForecast.tsx` — usar context para formatar temperaturas

### Arquivos de referência (não modificar)
- `tasks/prd-weather-dashboard/prd.md`
- `tasks/prd-weather-dashboard/techspec.md`
