from unidecode import unidecode


class EditDistanceService:
    def delta2(self, a: str, b: str) -> float:
        if a.lower() == b.lower():
            return 0
        if unidecode(a) == unidecode(b):
            return 0.5
        return 1

    def edit_distance(self, x: str, y: str, delta=None) -> float:
        if delta is None:
            delta = self.delta2
        edit_table = [[None] * (len(y) + 1) for _ in range(len(x) + 1)]
        for i in range(1, len(x) + 1):
            edit_table[i][0] = (i, i - 1, 0)
        for j in range(1, len(y) + 1):
            edit_table[0][j] = (j, 0, j - 1)
        edit_table[0][0] = (0, 0, 0)
        for i in range(len(x)):
            k = i + 1
            for j in range(len(y)):
                l = j + 1
                edit_table[k][l] = (edit_table[k - 1][l][0] + 1, k - 1, l)
                if edit_table[k][l - 1][0] + 1 < edit_table[k][l][0]:
                    edit_table[k][l] = (edit_table[k][l - 1][0] + 1, k, l - 1)
                if edit_table[k][l][0] > edit_table[k - 1][l - 1][0] + delta(x[i], y[j]):
                    edit_table[k][l] = (edit_table[k - 1][l - 1][0] + delta(x[i], y[j]), k - 1, l - 1)
        return edit_table[-1][-1][0]
