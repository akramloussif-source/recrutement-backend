package com.recrutement;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.Connection;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OracleConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    void testConnexionOracle() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            assertNotNull(conn);
            System.out.println("=== CONNEXION ORACLE OK ===");
            System.out.println("URL      : " + conn.getMetaData().getURL());
            System.out.println("User     : " + conn.getMetaData().getUserName());
            System.out.println("Version  : " + conn.getMetaData().getDatabaseProductVersion());
        }
    }
}