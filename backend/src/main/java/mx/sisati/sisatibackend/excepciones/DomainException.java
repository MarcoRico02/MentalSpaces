package mx.sisati.sisatibackend.excepciones;

public class DomainException extends RuntimeException {

    private final Class<?> domainEntity;

    public DomainException(Class<?> domainEntity, String message) {
        super(message);
        this.domainEntity = domainEntity;
    }

    public DomainException(Class<?> domainEntity, String message, Throwable cause) {
        super(message, cause);
        this.domainEntity = domainEntity;
    }

    public String getDomainEntity() {
        return domainEntity.getSimpleName();
    }
}
