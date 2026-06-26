interface ConfirmDialogProps {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  tipo?: 'danger' | 'normal';
  cargando?: boolean;
  onConfirmar: () => void;
  onCerrar: () => void;
}

function ConfirmDialog({
  abierto,
  titulo,
  descripcion,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  tipo = 'normal',
  cargando = false,
  onConfirmar,
  onCerrar
}: ConfirmDialogProps) {
  if (!abierto) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className={tipo === 'danger' ? 'confirm-icon danger' : 'confirm-icon'}>
          {tipo === 'danger' ? '!' : '?'}
        </div>

        <h2>{titulo}</h2>

        <p>{descripcion}</p>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-cancel"
            onClick={onCerrar}
            disabled={cargando}
          >
            {textoCancelar}
          </button>

          <button
            type="button"
            className={tipo === 'danger' ? 'confirm-button danger' : 'confirm-button'}
            onClick={onConfirmar}
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;