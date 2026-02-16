package mx.sisati.sisatibackend.finanzas.pago;

import lombok.Getter;

@Getter
public enum MetodoPago {
    TARJETA("Tarjeta de crédito/débito"),
    TRANSFERENCIA("Transferencia bancaria"),
    EFECTIVO("Pago en efectivo");

    private final String descripcion;

    MetodoPago(String descripcion) {
        this.descripcion = descripcion;
    }

    public boolean esManual() {
        return this == TRANSFERENCIA || this == EFECTIVO;
    }

    public boolean requiresStripe() {
        return this == TARJETA;
    }
}