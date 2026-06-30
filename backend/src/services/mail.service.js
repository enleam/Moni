const nodemailer = require('nodemailer');

const crearTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

const enviarCorreoRecuperacionPassword = async ({
  correoDestino,
  nombre,
  resetLink
}) => {
  if (process.env.MAIL_MODE !== 'gmail') {
    console.log('MAIL_MODE dev. Link de recuperación:', resetLink);
    return;
  }

  const transporter = crearTransporter();

  const fromName = process.env.MAIL_FROM_NAME || 'Moni';
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: correoDestino,
    subject: 'Recupera tu contraseña de Moni',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Recuperación de contraseña</h2>

          <p style="color: #4b5563; font-size: 15px;">
            Hola ${nombre || ''},
          </p>

          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Moni</strong>.
          </p>

          <p style="margin: 26px 0;">
            <a 
              href="${resetLink}" 
              style="background: #2563eb; color: #ffffff; padding: 13px 18px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;"
            >
              Restablecer contraseña
            </a>
          </p>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Si no solicitaste este cambio, puedes ignorar este correo.
          </p>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Este enlace expirará en unos minutos por seguridad.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            © 2026 Moni. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `
  });
};

const enviarCorreoVerificacionEmail = async ({
  correoDestino,
  nombre,
  verificationLink
}) => {
  if (process.env.MAIL_MODE !== 'gmail') {
    console.log('MAIL_MODE dev. Link de verificación:', verificationLink);
    return;
  }

  const transporter = crearTransporter();

  const fromName = process.env.MAIL_FROM_NAME || 'Moni';
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: correoDestino,
    subject: 'Verifica tu cuenta de Moni',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Verifica tu cuenta</h2>

          <p style="color: #4b5563; font-size: 15px;">
            Hola ${nombre || ''},
          </p>

          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Gracias por registrarte en <strong>Moni</strong>. Para activar tu cuenta, verifica tu correo haciendo click en el siguiente botón.
          </p>

          <p style="margin: 26px 0;">
            <a 
              href="${verificationLink}" 
              style="background: #2563eb; color: #ffffff; padding: 13px 18px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;"
            >
              Verificar cuenta
            </a>
          </p>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Si no creaste esta cuenta, puedes ignorar este correo.
          </p>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Este enlace expirará por seguridad.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            © 2026 Moni. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `
  });
};

module.exports = {
  enviarCorreoRecuperacionPassword,
  enviarCorreoVerificacionEmail
};