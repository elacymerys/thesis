class CategoryStorage {
    private static categoriesChosen = new Map<number, string>();

    static add(id: number, name: string) {
        CategoryStorage.categoriesChosen.set(id, name);
        console.log(this.categoriesChosen);
    }

    static remove(id: number) {
        CategoryStorage.categoriesChosen.delete(id);
        console.log(this.categoriesChosen);
    }
}

export default CategoryStorage;
