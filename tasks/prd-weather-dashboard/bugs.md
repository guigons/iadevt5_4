# Bugs - Weather Dashboard

## BUG-01: Geolocation exibe coordenadas brutas ao invés do nome da cidade

- **Severidade:** Alta
- **Componente:** Backend (weather.controller.ts)
- **Descrição:** Quando o usuário acessa o Weather Dashboard e a geolocalização é ativada automaticamente, o nome da localização exibido é a latitude e longitude brutas (ex: "-27.589125104684324, -48.547246548924875,") ao invés do nome da cidade (ex: "Florianópolis, Brasil").
- **Causa raiz:** No backend, quando coordenadas são recebidas (ao invés de nome de cidade), o controller simplesmente formata `${lat}, ${lon}` como location name sem fazer reverse geocoding. Não há chamada à API de geocodificação reversa para converter coordenadas em nome de cidade.
- **Arquivo:** `backend/src/weather/weather.controller.ts` (linhas 34-46)
- **Requisitos afetados:** RF01-RF03 (Detecção automática de geolocalização)
- **Screenshot:** `qa-02-bug-raw-coordinates.png`
- **Correção sugerida:** Implementar reverse geocoding no backend quando coordenadas são fornecidas, usando a Open-Meteo Geocoding API ou similar para resolver as coordenadas em nome de cidade e país.
- **Status:** Corrigido
- **Correção aplicada:** Adicionada função `reverseGeocode` no `weather.service.ts` que utiliza a API Nominatim (OpenStreetMap) para converter coordenadas em nome de cidade/país. O controller agora chama `reverseGeocode` quando coordenadas são fornecidas ao invés de usar `${lat}, ${lon}`.
- **Testes de regressão:**
  - `weather.service.test.ts`: 5 testes unitários para `reverseGeocode` (city, town, village, fallback coordinates, error propagation)
  - `weather.controller.test.ts`: 1 teste de integração verificando que coordenadas passam por reverse geocoding

---

## BUG-02: Pills de detalhes do clima (Sensação, Umidade, Vento) overflow em mobile

- **Severidade:** Média
- **Componente:** Frontend (CurrentWeather.tsx)
- **Descrição:** Na viewport mobile (375px), as pills com informações de Sensação, Umidade e Vento ultrapassam a largura da tela. "Sensação" fica cortada à esquerda e "Vento X km/h" fica cortada à direita.
- **Requisitos afetados:** Responsividade (Task 3 - critérios de sucesso)
- **Screenshot:** `qa-11-mobile-overflow-bug.png`
- **Correção sugerida:** Ajustar o layout das pills para wrap em múltiplas linhas ou reduzir o tamanho/espaçamento em telas menores usando classes responsivas do Tailwind (ex: `flex-wrap` ou layout vertical em `sm:`).
- **Status:** Corrigido
- **Correção aplicada:** Adicionado `flex-wrap` ao container das pills no `CurrentWeather.tsx`, reduzido gap de `gap-6` para `gap-3`, reduzido padding horizontal das pills de `px-4` para `px-3`, e adicionado `px-2` ao container para margem lateral em mobile.
- **Testes de regressão:**
  - `CurrentWeather.test.tsx`: 1 teste verificando que o container possui a classe `flex-wrap`

---

## BUG-03: Busca por "New York" retorna "York, EUA" (cidade errada)

- **Severidade:** Média
- **Componente:** Backend (weather.service.ts / geocoding)
- **Descrição:** Ao buscar "New York", a API de geocodificação retorna "York" no Nebraska (coordenadas 40.868, -97.592) ao invés de "New York City" (coordenadas ~40.71, -74.00). O primeiro resultado da API Open-Meteo Geocoding não é necessariamente o mais relevante.
- **Requisitos afetados:** RF04-RF07 (Busca de cidade)
- **Screenshot:** `qa-12-bug-york-instead-newyork.png`
- **Correção sugerida:** Revisar a lógica de seleção do resultado da API de geocodificação. Considerar ordenar por população ou relevância, ou usar o resultado que melhor corresponde ao termo de busca completo.
- **Status:** Corrigido
- **Correção aplicada:** A função `searchCity` agora busca 10 resultados da API Open-Meteo (ao invés de 5), ordena por `population` descrescente (tratando `undefined` como 0), e retorna os 5 primeiros. O tipo `OpenMeteoGeocodingResponse` foi atualizado para incluir o campo `population`.
- **Testes de regressão:**
  - `weather.service.test.ts`: 3 testes unitários para ordenação por população (sort descending, undefined as 0, limit to 5)
