import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual">
          <div className="auth-visual-content">
            <span className="auth-visual-badge">MONI</span>

            <h2>Organiza tu dinero con Moni</h2>

            <p>
              Registra ingresos, controla gastos, define presupuestos y alcanza
              tus metas de ahorro desde un solo lugar.
            </p>

            <div className="auth-graphics">
              <div className="auth-graph-card auth-graph-line">
                <span className="graph-title">Resumen visual</span>

                <div className="line-chart">
                  <svg viewBox="0 0 360 130" preserveAspectRatio="none">
                    <polyline
                      points="20,95 90,58 150,78 230,35 320,62"
                      fill="none"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle cx="20" cy="95" r="9" />
                    <circle cx="90" cy="58" r="9" />
                    <circle cx="150" cy="78" r="9" />
                    <circle cx="230" cy="35" r="9" />
                    <circle cx="320" cy="62" r="9" />
                  </svg>
                </div>
              </div>

              <div className="auth-graph-row">
                <div className="auth-graph-card auth-graph-pie">
                  <span className="graph-title">Distribución</span>
                  <div className="pie-chart"></div>
                </div>

                <div className="auth-graph-card auth-graph-bars">
                  <span className="graph-title">Tendencia</span>

                  <div className="bar-chart">
                    <span className="bar bar-1"></span>
                    <span className="bar bar-2"></span>
                    <span className="bar bar-3"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          {children}
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;