package pl.edu.agh.quizzesthesis.business;

import me.xuender.unidecode.Unidecode;
import org.springframework.stereotype.Service;

@Service
public class EditDistanceService {

    public float editDistance(String a, String b) {
        float[][][] editTable = new float[a.length() + 1][b.length() + 1][3];
        for (int i = 1; i <= a.length(); i++) {
            editTable[i][0] = new float[]{i, i - 1, 0};
        }
        for (int j = 1; j <= b.length(); j++) {
            editTable[0][j] = new float[]{j, 0, j - 1};
        }
        editTable[0][0] = new float[]{0, 0, 0};

        for (int i = 0; i < a.length(); i++) {
            int k = i + 1;
            for (int j = 0; j < b.length(); j++) {
                int l = j + 1;
                editTable[k][l] = new float[]{editTable[k - 1][l][0] + 1, k - 1, l};
                if (editTable[k][l - 1][0] + 1 < editTable[k][l][0]) {
                    editTable[k][l] = new float[]{editTable[k][l - 1][0] + 1, k, l - 1};
                }
                if (editTable[k][l][0] > editTable[k - 1][l - 1][0] + delta2(a.charAt(i), b.charAt(j))) {
                    editTable[k][l] = new float[]{editTable[k - 1][l - 1][0] + delta2(a.charAt(i), b.charAt(j)), k - 1, l - 1};
                }
            }
        }
        return editTable[a.length()][b.length()][0];
    }

    private float delta2(char a, char b) {
        if (a == b) {
            return 0.0f;
        } else if (Unidecode.decode(String.valueOf(a)).equals(Unidecode.decode(String.valueOf(b)))) {
            return 0.5f;
        } else {
            return 1.0f;
        }
    }
}
