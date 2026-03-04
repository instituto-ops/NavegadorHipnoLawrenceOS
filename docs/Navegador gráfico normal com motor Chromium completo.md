<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# como o assistente do comet consegue navegar pela doctoralia? Ela não entende que é um robo?

Ele navega pela Doctoralia porque, para o site, ele parece **um usuário comum usando um navegador Chromium**, não um “robô clássico” tipo Selenium ou headless browser.[^1][^2][^3]

## O que o Comet faz “por baixo do capô”

- O Comet é um navegador inteiro, baseado em Chromium, com uma camada de IA por cima.[^1]
- Quando você manda o assistente “buscar psicólogos em Goiânia na Doctoralia”, ele liga um modo de agente que **assume controle do mouse e do teclado**, clicando, rolando e preenchendo campos exatamente como você faria.[^2][^4]
- Ao mesmo tempo ele lê o DOM da página (estrutura de HTML) para entender onde estão botões, campos de busca, resultados etc., e vai tomando decisões passo a passo.


## Por que a Doctoralia não “percebe” que é IA

- Sites costumam detectar bots olhando para coisas como: uso de WebDriver/Selenium, navegador sem interface (headless), tempo entre cliques muito mecânico, IP estranho, padrões de requisição muito rápidos, presença da flag `navigator.webdriver` etc.[^5][^6]
- Como o Comet é um navegador gráfico normal, com motor Chromium completo, ele **não se apresenta como WebDriver** nem como browser sem cabeça, então passa por quase todos os filtros de “bot detection” padrão.[^1][^2][^5]
- Do ponto de vista da Doctoralia, o que chega é: um usuário logado, num Chrome-like, movendo o mouse, clicando em links e preenchendo formulários com velocidade relativamente humana.


## Limites e quando o site pode barrar

- Se a Doctoralia usar coisas mais agressivas (CAPTCHA, desafios de Cloudflare, reCAPTCHA v3), ela pode começar a suspeitar se o padrão de interação ficar muito mecânico ou muito rápido.[^5][^6]
- Na prática, muitos testes de usuários mostram que o Comet às vezes trava, entra em loop ou não consegue completar tarefas em sites com proteções mais chatas ou fluxos muito complexos.[^1][^7]


## Resumindo em termos “clínicos”

Ele não “engana” a Doctoralia fingindo ser humano em nível cognitivo; ele só opera **no mesmo nível que você** (interface gráfica do navegador), em vez de usar APIs ou robôs típicos de automação que são fáceis de detectar. Para o site, é só mais um navegador comum executando JavaScript e eventos de clique.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.alura.com.br/artigos/comet

[^2]: https://www.seudinheiro.com/2025/financas-pessoais/testamos-comet-novo-navegador-com-ia-da-perplexity-jocf/

[^3]: https://www.perplexity.ai/comet/

[^4]: https://play.google.com/store/apps/details?id=ai.perplexity.comet\&hl=pt_BR

[^5]: https://www.browserscan.net/pt/bot-detection

[^6]: https://capmonster.cloud/pt-BR/blog/why-do-websites-think-im-a-bot-how-detection-systems-work-and-how-to-avoid-blocks

[^7]: https://xpert.digital/pt/navegador-do-agente-cometa/

[^8]: image.jpg

[^9]: https://www.youtube.com/watch?v=-JyxKvaW660

[^10]: https://www.reddit.com/r/perplexity_ai/comments/1n8jl6i/impressed_by_perplexitys_comet_browser_assistant/

[^11]: https://www.perplexity.ai/pt/comet/resources/articles/comet-assistant-vs-agent

[^12]: https://latenode.com/pt-br/blog/tools-software-reviews/best-automation-tools/comet-browser-ai-fix

[^13]: https://www.youtube.com/watch?v=r5ILfas8a34

[^14]: https://www.seohappyhour.com/blog/comet-perplexity/

[^15]: https://pplx-comet.framer.website/pt/

[^16]: https://www.reddit.com/r/automation/comments/1o5ffqm/i_built_a_browser_automation_tool_and_it_works/

