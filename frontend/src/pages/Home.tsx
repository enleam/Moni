import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-brand">
          <img src="/moni-logo.png" alt="Logo de Moni" className="home-logo-img" />
          <strong>Moni</strong>
        </div>

        <nav className="home-nav">
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/registro" className="home-nav-button">
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-badge">Gestión financiera personal</span>

            <h1>Organiza tu dinero de forma simple con Moni</h1>

            <p>
              Moni es una aplicación web que te permite registrar ingresos,
              controlar gastos, crear presupuestos, revisar reportes y definir
              metas de ahorro desde un solo lugar.
            </p>

            <div className="home-actions">
              <Link to="/registro" className="home-primary-button">
                Empezar ahora
              </Link>

              <Link to="/login" className="home-secondary-button">
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          <div className="home-hero-card">
            <h2>Resumen mensual</h2>

            <div className="home-mini-kpi">
              <span>Ingresos</span>
              <strong>S/ 2,500.00</strong>
            </div>

            <div className="home-mini-kpi expense">
              <span>Gastos</span>
              <strong>S/ 1,250.00</strong>
            </div>

            <div className="home-progress-preview">
              <div>
                <span>Meta de ahorro</span>
                <strong>60%</strong>
              </div>

              <div className="home-progress-bar">
                <div />
              </div>
            </div>
          </div>
        </section>

        <section className="home-features">
          <div className="home-section-title">
            <h2>¿Qué puedes hacer con Moni?</h2>
            <p>
              Una herramienta sencilla para tener más control sobre tus finanzas.
            </p>
          </div>

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <h3>Registra movimientos</h3>
              <p>
                Guarda tus ingresos y gastos por categoría, fecha, monto y método
                de pago.
              </p>
            </article>

            <article className="home-feature-card">
              <h3>Controla presupuestos</h3>
              <p>
                Define límites mensuales por categoría y revisa tu avance durante
                el mes.
              </p>
            </article>

            <article className="home-feature-card">
              <h3>Visualiza reportes</h3>
              <p>
                Consulta gráficos, resúmenes y reportes mensuales para tomar
                mejores decisiones.
              </p>
            </article>

            <article className="home-feature-card">
              <h3>Crea metas de ahorro</h3>
              <p>
                Define objetivos financieros y registra tus avances hasta
                completarlos.
              </p>
            </article>
          </div>
        </section>

        <section className="home-benefits">
            <div className="home-section-title">
                <h2>¿Por qué usar Moni?</h2>
                <p>Una forma sencilla de entender mejor tus hábitos financieros.</p>
            </div>

            <div className="home-benefit-grid">
                <article>
                <h3>Simple de usar</h3>
                <p>Registra tus movimientos sin complicaciones y consulta tu información rápidamente.</p>
                </article>

                <article>
                <h3>Control mensual</h3>
                <p>Analiza tus ingresos, gastos y presupuestos por mes para tomar mejores decisiones.</p>
                </article>

                <article>
                <h3>Metas claras</h3>
                <p>Define objetivos de ahorro y visualiza tu progreso hasta completarlos.</p>
                </article>
            </div>
        </section>

        <section className="home-contact">
            <div className="home-contact-card">
                <div>
                <h2>¿Tienes dudas o sugerencias?</h2>
                <p>
                    Puedes contactarme para enviar comentarios, reportar problemas o proponer
                    nuevas ideas para mejorar Moni.
                </p>
                </div>

                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=huapayabohorquezflavio@gmail.com&su=Sugerencia%20sobre%20Moni&body=Hola,%20tengo%20una%20consulta%20o%20sugerencia%20sobre%20Moni:"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="home-contact-button"
                >
                    Enviar correo
                </a>
            </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <strong>Moni</strong>
          <p>© 2026 Moni. Todos los derechos reservados.</p>
        </div>

        <div>
          <span>Desarrollado por:</span>
          <p>Flavio Huapaya Bohorquez</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;