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

    static getRandom() {
        const categoryIds = Array.from(this.categoriesChosen.keys());
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        return { id: categoryId, name: this.categoriesChosen.get(categoryId)! }
    }

    static isEmpty() {
        const categoryIds = Array.from(this.categoriesChosen.keys());
        return !categoryIds.length;
    }
}

export default CategoryStorage;
