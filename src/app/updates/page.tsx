import { APP_VERSION } from "@/app/config/version";

export default function UpdatesPage() {
  return (
    <section className="section container">
      <h1>🚀 Co nowego – v{APP_VERSION}</h1>

      <ul style={{ marginTop: 20, lineHeight: 1.8 }}>
        <li>✅ 3 pakiety: Start / Standard / Pro</li>
        <li>💳 Płatności Stripe + BLIK (PLN)</li>
        <li>🧠 Limity AI zależne od pakietu</li>
        <li>🖥 Nowy dashboard użytkownika</li>
        <li>✨ Odświeżony generator opisów</li>
        <li>🔐 Bezpieczna aktywacja pakietu przez webhook</li>
      </ul>
    </section>
  );
}
