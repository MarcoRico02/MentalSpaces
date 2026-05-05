package mx.sisati.sisatibackend.cloudflare;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;

@Service
public class AlmacenamientoService {
    private final S3Client r2Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    public AlmacenamientoService(S3Client r2Client) {
        this.r2Client = r2Client;
    }

    public String upload(String key, InputStream file, long size, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        r2Client.putObject(request, RequestBody.fromInputStream(file, size));

        return key;
    }

    public void delete(String key) {

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        r2Client.deleteObject(request);
    }
}
