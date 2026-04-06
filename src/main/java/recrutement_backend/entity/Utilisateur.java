package recrutement_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UTILISATEURS")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "ROLE_TYPE")
@Data @NoArgsConstructor @AllArgsConstructor
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "util_seq")
    @SequenceGenerator(name = "util_seq",
            sequenceName = "UTIL_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String login;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String role;

    public Boolean sAuthentifier() { return true; }
}
