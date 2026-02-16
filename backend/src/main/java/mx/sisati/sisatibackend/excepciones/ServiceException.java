package mx.sisati.sisatibackend.excepciones;

public class ServiceException extends RuntimeException {

    private final Class<?> service;

    public ServiceException(Class<?> service, String message) {
        super(message);
        this.service = service;
    }

    public String getService() {
        return service.getSimpleName();
    }
}
