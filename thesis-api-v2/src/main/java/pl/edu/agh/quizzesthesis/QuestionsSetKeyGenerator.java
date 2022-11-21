package pl.edu.agh.quizzesthesis;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.util.Random;

public class QuestionsSetKeyGenerator implements IdentifierGenerator {

    private static final char[] ALLOWED_KEY_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789".toCharArray();
    private static final int KEY_LENGTH = 8;

    @Override
    public Serializable generate(
            SharedSessionContractImplementor session, Object object)
            throws HibernateException {
        String query = String.format("select %s from %s",
                session.getEntityPersister(object.getClass().getName(), object)
                        .getIdentifierPropertyName(),
                object.getClass().getSimpleName());

        var persistedKeys = session.createQuery(query).stream().toList();

        var questionSetKey = generateRandomKey();
        while (persistedKeys.contains(questionSetKey)) {
            questionSetKey = generateRandomKey();
        }
        return questionSetKey;
    }

    private String generateRandomKey() {
        var keyBuilder = new StringBuilder(KEY_LENGTH);
        var random = new Random();
        for (int i = 0; i < KEY_LENGTH; i++) {
            int index = random.nextInt(ALLOWED_KEY_CHARACTERS.length);
            keyBuilder.append(ALLOWED_KEY_CHARACTERS[index]);
        }
        return keyBuilder.toString();
    }
}
