import { useRef } from "react";
import MidnightCountdown from "./MidnightCountdown";

const benefits = [
  "Receitas testadas",
  "Calculadora de custos",
  "Gerenciador de vendas",
  "Manual para realizar as primeiras vendas",
];

export default function SubscriptionOffers() {
  const offers = useRef(null);

  function showPlans() {
    offers.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    offers.current?.focus({ preventScroll: true });
  }

  return (
    <div className="subscription-offers step-enter">
      <p className="sr-only" role="status">A assinatura mensal já está disponível abaixo do vídeo.</p>
      <button type="button" className="primary-button access-button" onClick={showPlans} aria-controls="subscription-plans">Quero meu acesso</button>
      <section id="subscription-plans" ref={offers} tabIndex={-1} aria-label="Oferta de assinatura mensal" className="subscription-grid focus-heading">
        <MidnightCountdown />
        <article className="subscription-card">
          <h2>Assinatura mensal</h2>
          <div className="subscription-pricing">
            <p className="previous-price">De <s>R$ 47,00</s> por</p>
            <p className="subscription-price">R$ 14,90<span>/mês</span></p>
          </div>
          <p className="billing-note">Cobrança mensal de R$ 14,90.</p>
          <ul>{benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul>
          <p className="subscription-guarantee">7 dias de garantia</p>
          <a className="primary-button checkout-button" href="https://pay.cakto.com.br/frq59gq_1135591">Quero assinar por R$ 14,90/mês</a>
        </article>
      </section>
    </div>
  );
}
