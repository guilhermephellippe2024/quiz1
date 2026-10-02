// Content and branching migrated verbatim from quiz_metodo_geleias_que_vendem_v2.html.
// Keep presentation concerns in components; these functions only resolve quiz content.
export const answerKeys = ["experience", "age", "situation", "desire", "problem", "attempt", "reason", "help"];

export function createQuizFlow(state) {
const steps=["Sua situação","O que você quer","O que te trava","O que você já tentou","Por que ainda não deu certo","O que mais te ajudaria","Seu resultado","Vídeo"];
const situations=[{id:"start",text:"Quero começar a vender geleias, mas não sei por onde começar"},{id:"failed",text:"Já tentei vender outras coisas antes e não deu certo"},{id:"made",text:"Já fiz geleias, mas não sei quanto cobrar"},{id:"selling",text:"Já vendo e quero organizar melhor meus custos e lucros"}];
const desires=[{id:"bills",text:"Quero ajudar nas contas de casa"},{id:"ownmoney",text:"Quero ter meu próprio dinheiro"},{id:"family",text:"Quero aumentar a renda da minha família"},{id:"workhome",text:"Quero ganhar dinheiro trabalhando de casa"}];
function desireQuestion(){
  if(state.situation?.id==="made"){
    return{
      q:"Por que você gostaria de transformar suas geleias em uma renda?",
      sub:"Escolha a opção que mais combina com o que você busca neste momento.",
      options:[
        {id:"bills",text:"Quero ajudar nas contas de casa"},
        {id:"ownmoney",text:"Quero ter meu próprio dinheiro"},
        {id:"family",text:"Quero aumentar a renda da minha família"},
        {id:"workhome",text:"Quero ganhar dinheiro com algo que já sei fazer"}
      ]
    };
  }

  if(state.situation?.id==="selling"){
    return{
      q:"O que você mais gostaria de melhorar hoje nas suas vendas de geleias?",
      sub:"Escolha o que faria mais diferença para você neste momento.",
      options:[
        {id:"earnmore",text:"Ganhar mais com o que eu já vendo"},
        {id:"organize",text:"Organizar melhor meus gastos e vendas"},
        {id:"sellmore",text:"Conseguir vender mais"},
        {id:"clarity",text:"Entender melhor quanto realmente sobra para mim"}
      ]
    };
  }

  return{
    q:"Por que você gostaria de começar a vender geleias?",
    sub:"Escolha a opção que mais combina com o que você busca neste momento.",
    options:desires
  };
}

const problems={start:[{id:"production",text:"Tenho medo de a geleia não ficar boa o suficiente"},{id:"pricing",text:"Não sei quanto cobrar"},{id:"clients",text:"Não sei para quem vender"},{id:"risk",text:"Tenho medo de gastar dinheiro e não conseguir vender"}],failed:[{id:"confidence",text:"Tenho medo de tentar de novo e me frustrar"},{id:"clients",text:"Tenho dificuldade para conseguir clientes"},{id:"risk",text:"Tenho medo de perder dinheiro de novo"},{id:"direction",text:"Eu começo animada, mas depois fico sem saber o que fazer"}],made:[{id:"pricing",text:"Não sei quanto cobrar por cada pote"},{id:"profit",text:"Não sei se realmente vai sobrar dinheiro"},{id:"clients",text:"Não sei para quem vender primeiro"},{id:"production",text:"Ainda não tenho segurança de fazer a geleia ficar boa sempre"}],selling:[{id:"profit",text:"Não sei direito quanto sobra de lucro"},{id:"organization",text:"Misturo vendas, gastos e anotações e me perco"},{id:"clients",text:"Quero vender mais, mas não sei como conseguir novos clientes"},{id:"time",text:"Perco muito tempo fazendo contas e anotando tudo"}]};
const attempts=[{id:"sweets",text:"Brigadeiros, bolos de pote ou doces em geral"},{id:"meals",text:"Marmitas ou comida pronta"},{id:"snacks",text:"Salgados, lanches ou quitandas"},{id:"nothing",text:"Nunca vendi nenhum produto"}];
function attemptQuestion(){
  if(state.situation?.id==="selling"){
    return{
      q:"O que você já tentou fazer para vender mais suas geleias?",
      sub:"Escolha a opção que mais parece com o que você já fez até hoje.",
      options:[
        {id:"social",text:"Postei ou divulguei nas redes sociais"},
        {id:"whatsapp",text:"Ofereci para conhecidos ou pelo WhatsApp"},
        {id:"promo",text:"Fiz promoção ou baixei o preço"},
        {id:"nothinggrow",text:"Ainda não tentei nada específico para vender mais"}
      ]
    };
  }

  return{
    q:"Você já tentou ganhar dinheiro vendendo algum desses produtos?",
    sub:"Escolha a opção que mais se parece com o que você já tentou.",
    options:attempts
  };
}

function reasonQ(){
  if(state.situation?.id==="selling"){
    if(state.attempt?.id==="nothinggrow"){
      return{
        q:"O que mais te impede de tentar vender mais hoje?",
        options:[
          {id:"wheregrow",text:"Não sei o que fazer para conseguir novos clientes"},
          {id:"timegrow",text:"Não tenho tempo para ficar divulgando o tempo todo"},
          {id:"shygrow",text:"Não gosto de ficar oferecendo para as pessoas"},
          {id:"ideagrow",text:"Não sei qual tipo de divulgação realmente funciona"}
        ]
      };
    }

    return{
      q:"Por que você acha que isso ainda não trouxe as vendas que gostaria?",
      options:[
        {id:"reachgrow",text:"Poucas pessoas ficam sabendo que eu vendo"},
        {id:"constgrow",text:"Eu divulgo algumas vezes e depois acabo parando"},
        {id:"offergrow",text:"Não sei muito bem o que falar para fazer as pessoas comprarem"},
        {id:"knowgrow",text:"Não sei o que realmente está funcionando ou não"}
      ]
    };
  }

  if(state.attempt?.id==="nothing"){
    return{
      q:"O que mais te impediu de começar até hoje?",
      options:[
        {id:"where",text:"Não saber por onde começar"},
        {id:"fear",text:"Medo de fazer errado e perder dinheiro"},
        {id:"confused",text:"Ver muita informação e ficar ainda mais confusa"},
        {id:"alone",text:"Sentir que teria que descobrir tudo sozinha"}
      ]
    };
  }

  return{
    q:"O que mais fez você parar ou não continuar vendendo?",
    options:[
      {id:"where",text:"Eu não sabia qual era o próximo passo"},
      {id:"confused",text:"Fui fazendo do meu jeito e acabei me perdendo"},
      {id:"numbers",text:"Eu não sabia direito quanto gastava nem quanto ganhava"},
      {id:"clients",text:"Eu tinha dificuldade para conseguir clientes"}
    ]
  };
}

function helpQBase(){const map={production:{q:"O que mais te deixaria segura para começar?",options:[{id:"app",text:"Um aplicativo mostrando a receita e cada passo do preparo"},{id:"price",text:"Saber quanto gastar e quanto cobrar"},{id:"sales",text:"Saber como fazer as primeiras vendas"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},pricing:{q:"O que mais facilitaria para você começar?",options:[{id:"price",text:"Um aplicativo que me ajude a calcular custo e preço"},{id:"recipe",text:"Receitas simples para começar com poucos sabores"},{id:"sales",text:"Saber como conseguir as primeiras vendas"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},clients:{q:"O que mais facilitaria para você começar a vender?",options:[{id:"sales",text:"Um passo a passo mostrando como buscar as primeiras vendas"},{id:"price",text:"Saber quanto cobrar sem ficar na dúvida"},{id:"recipe",text:"Ter receitas simples e testadas para começar"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},risk:{q:"O que mais te daria segurança para começar sem gastar à toa?",options:[{id:"price",text:"Saber quanto custa cada pote antes de produzir"},{id:"recipe",text:"Seguir receitas simples para evitar erros e desperdício"},{id:"sales",text:"Saber como começar vendendo aos poucos"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},confidence:{q:"O que mais faria você sentir que desta vez pode ser diferente?",options:[{id:"app",text:"Ter um passo a passo simples para não ficar perdida"},{id:"price",text:"Saber os custos antes de gastar dinheiro"},{id:"sales",text:"Saber como começar vendendo aos poucos"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},direction:{q:"O que mais te ajudaria a não ficar perdida no meio do caminho?",options:[{id:"app",text:"Um aplicativo mostrando o que fazer primeiro e o que vem depois"},{id:"recipe",text:"Receitas simples para começar"},{id:"price",text:"Ajuda para calcular custo e preço"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},profit:{q:"O que mais te ajudaria a saber se vale a pena vender?",options:[{id:"price",text:"Saber quanto custa cada pote e quanto cobrar"},{id:"track",text:"Ver quanto entrou de dinheiro e quanto sobrou"},{id:"recipe",text:"Ter receitas com medidas claras para repetir sempre"},{id:"all",text:"Ter tudo isso organizado em um só lugar"}]},organization:{q:"O que mais ajudaria você a organizar melhor suas vendas?",options:[{id:"track",text:"Ter um lugar para anotar vendas e ver quanto sobrou"},{id:"price",text:"Calcular o custo e o preço de cada pote"},{id:"recipe",text:"Ter as receitas já organizadas"},{id:"all",text:"Ter tudo isso no mesmo aplicativo"}]},time:{q:"O que mais ajudaria você a perder menos tempo com contas e anotações?",options:[{id:"track",text:"Um aplicativo para registrar as vendas"},{id:"price",text:"Uma forma simples de calcular custo e preço"},{id:"recipe",text:"Receitas já organizadas para eu só seguir"},{id:"all",text:"Ter tudo isso no mesmo aplicativo"}]}};return map[state.problem?.id]||map.production}

function helpQ(){
  if(state.situation?.id==="selling"){
    const p=state.problem?.id;

    if(p==="clients"){
      return{
        q:"O que mais ajudaria você a conseguir vender mais?",
        options:[
          {id:"sales",text:"Ter ideias simples do que fazer para conseguir novos clientes"},
          {id:"track",text:"Entender melhor o que está vendendo mais"},
          {id:"price",text:"Saber se meus preços estão certos"},
          {id:"all",text:"Ter vendas, preços e resultados organizados no mesmo lugar"}
        ]
      };
    }

    if(p==="profit"){
      return{
        q:"O que mais ajudaria você a ganhar melhor com suas vendas?",
        options:[
          {id:"price",text:"Saber quanto custa cada pote e quanto realmente sobra"},
          {id:"track",text:"Acompanhar vendas, gastos e lucro de forma simples"},
          {id:"sales",text:"Conseguir vender mais sem baixar tanto o preço"},
          {id:"all",text:"Ter tudo isso organizado no mesmo lugar"}
        ]
      };
    }

    if(p==="organization"){
      return{
        q:"O que mais facilitaria sua rotina de vendas?",
        options:[
          {id:"track",text:"Ter um lugar simples para anotar vendas e gastos"},
          {id:"price",text:"Calcular custo e preço sem fazer contas toda hora"},
          {id:"sales",text:"Saber quais produtos estão vendendo melhor"},
          {id:"all",text:"Ter tudo isso organizado no mesmo aplicativo"}
        ]
      };
    }

    if(p==="time"){
      return{
        q:"O que mais ajudaria você a perder menos tempo no dia a dia?",
        options:[
          {id:"track",text:"Registrar vendas e resultados de forma mais rápida"},
          {id:"price",text:"Fazer contas de custo e preço sem complicação"},
          {id:"sales",text:"Ter mais clareza do que vale a pena vender"},
          {id:"all",text:"Ter tudo isso organizado no mesmo aplicativo"}
        ]
      };
    }
  }

  return helpQBase();
}


function desireText(){return{bills:"ajudar nas contas de casa",ownmoney:"ter o próprio dinheiro",family:"aumentar a renda da família",workhome:"ganhar dinheiro trabalhando de casa",earnmore:"ganhar mais com o que já vende",organize:"organizar melhor os gastos e as vendas",sellmore:"conseguir vender mais",clarity:"entender melhor quanto realmente sobra de dinheiro"}[state.desire?.id]||"melhorar sua renda com geleias"}function problemText(){return{production:"a insegurança de a geleia não ficar boa",pricing:"a dúvida sobre quanto cobrar",clients:"não saber para quem vender",risk:"o medo de gastar dinheiro e não vender",confidence:"o medo de tentar de novo e se frustrar",direction:"não saber qual passo dar depois",profit:"não saber quanto realmente sobra de dinheiro",organization:"a falta de organização com vendas e gastos",time:"o tempo gasto com contas e anotações"}[state.problem?.id]||"não saber por onde começar"}function reasonText(){return{
      where:"faltou um caminho claro para seguir",
      fear:"o medo de errar acabou falando mais alto",
      confused:"você encontrou muita informação, mas pouca orientação",
      alone:"você sentiu que teria que descobrir tudo sozinha",
      numbers:"faltou clareza sobre gastos e preço",
      clients:"faltou saber como conseguir clientes",
      wheregrow:"ainda falta saber o que fazer para conseguir novos clientes",
      timegrow:"falta uma forma mais simples de vender sem depender de divulgação o tempo todo",
      shygrow:"vender ainda parece depender demais de ficar oferecendo para as pessoas",
      ideagrow:"ainda falta clareza sobre como divulgar de um jeito que funcione",
      reachgrow:"ainda poucas pessoas ficam sabendo que você vende",
      constgrow:"a divulgação acaba acontecendo só de vez em quando",
      offergrow:"ainda falta clareza sobre como apresentar suas geleias para gerar mais pedidos",
      knowgrow:"ainda falta entender melhor o que está funcionando nas suas vendas"
    }[state.reason?.id]||"faltou um caminho simples"}

function helpText(){
  if(isSelling()){
    return{
      app:"um aplicativo para organizar melhor o que você já faz",
      price:"mais clareza sobre custos e preços",
      sales:"um caminho mais simples para conseguir novos clientes e vender mais",
      recipe:"receitas organizadas para facilitar sua rotina",
      track:"um lugar simples para acompanhar vendas e dinheiro",
      all:"ter vendas, preços e resultados organizados no mesmo lugar"
    }[state.help?.id]||"um jeito mais simples de organizar e melhorar suas vendas";
  }

  return{
    app:"um aplicativo mostrando o que fazer passo a passo",
    price:"ajuda para saber custos e preços",
    sales:"um caminho para conseguir as primeiras vendas",
    recipe:"receitas simples para seguir",
    track:"um lugar simples para acompanhar vendas e dinheiro",
    all:"ter receitas, custos, vendas e acompanhamento no mesmo lugar"
  }[state.help?.id]||"um caminho mais simples";
}
function isSelling(){return state.situation?.id==="selling"}

function step5Sub(){
  return isSelling()
    ? "Pense no que faria mais diferença para você vender melhor e ter mais controle do que já faz."
    : "Pense no que faria você se sentir mais segura para sair da ideia e começar.";
}

function diagnosisCopy(){
  if(isSelling()){
    return{
      title:"Pelo que você respondeu, você já começou. Agora o próximo passo é vender com mais clareza.",
      body:`Você quer <strong>${desireText()}</strong> e hoje <strong>${problemText()}</strong> está dificultando esse crescimento.<br><br>Pelo que você já tentou, parece que <strong>${reasonText()}</strong>.<br><br>Por isso, faz sentido que o que mais te ajudaria agora seja <strong>${helpText()}</strong>.`,
      sub:"Ou seja: você não precisa voltar ao começo. Precisa organizar melhor o que já faz e enxergar com mais clareza o próximo passo."
    };
  }

  return{
    title:"Pelo que você respondeu, o problema não é falta de vontade.",
    body:`Você quer <strong>${desireText()}</strong>, mas hoje <strong>${problemText()}</strong> está segurando você.<br><br>E olhando para o que você já tentou, parece que <strong>${reasonText()}</strong>.<br><br>Por isso, faz sentido que o que mais te ajudaria agora seja <strong>${helpText()}</strong>.`,
    sub:"Ou seja: você não precisa de mais informação solta. Você precisa saber qual é o próximo passo."
  };
}


  function screen(step) {
    if (step === 0) return {
      stage: "Sua experiência",
      title: "Descubra o que falta para você começar a vender suas primeiras geleias",
      sub: "Responda algumas perguntas rápidas. Leva menos de 1 minuto.",
      question: "Você já fez geleia caseira alguma vez?",
      options: [
        { id: "often", text: "Faço sempre" },
        { id: "once", text: "Fiz uma vez" },
        { id: "beginner", text: "Quero começar" },
      ],
    };
    if (step === 1) return {
      stage: "Sua idade",
      title: "Só para entendermos melhor seu momento: qual é sua idade?",
      options: [
        { id: "18-25", text: "18 a 25" },
        { id: "26-35", text: "26 a 35" },
        { id: "36-55", text: "36 a 55" },
        { id: "56-plus", text: "56+" },
      ],
    };
    step -= 2;
    const stage = steps[step];
    if (step === 0) return {
      stage, title: "Qual destas situações mais parece com a sua hoje?", options: situations,
    };
    if (step === 1) { const d = desireQuestion(); return { stage, title: d.q, sub: d.sub, options: d.options }; }
    if (step === 2) return { stage, title: "O que mais te impede de dar o próximo passo hoje?", sub: "Pense no que mais te trava quando você imagina começar ou melhorar suas vendas.", options: problems[state.situation.id] };
    if (step === 3) { const d = attemptQuestion(); return { stage, title: d.q, sub: d.sub, options: d.options }; }
    if (step === 4) { const d = reasonQ(); return { stage, title: d.q, sub: "Escolha a opção que mais parece com o que aconteceu com você.", options: d.options }; }
    if (step === 5) { const d = helpQ(); return { stage, title: d.q, sub: step5Sub(), options: d.options }; }
    if (step === 6) return { stage, ...diagnosisCopy(), button: "Isso faz sentido para mim" };
    if (step === 7) return { stage: "Vídeo", title: "Conheça o Método Geleias que Vendem", videoId: 1231891598 };
    throw new RangeError("Etapa inválida do quiz");
  }
  return { screen };
}
