import {createContext, FC, useContext, useEffect, useState} from "react";
import {LoadingState} from "../types/loading-state";
import {Category} from "../types/category";
import { categoryService } from "../services/category-service";
import {useUserContext} from "./UserContext";
import {ApiError, isApiError} from "../types/api-error";
import {HttpStatusCode} from "../utils/http-status-code";

type CategoryContextType = {
    loadingState: LoadingState,
    categories: Category[],
    chosenCategories: Category[],
    getCategories: () => void,
    getRandom: () => Category | undefined,
    chooseCategories: (categories: Category[]) => void,
};

const CATEGORY_CONTEXT_INIT_STATE: CategoryContextType = {
    loadingState: 'LOADING',
    categories: [],
    chosenCategories: [],
    getRandom: () => undefined,
    getCategories: () => {},
    chooseCategories: () => {}
};

const CategoryContext = createContext<CategoryContextType>(CATEGORY_CONTEXT_INIT_STATE);

export const CategoryContextProvider: FC = ({ children }) => {
    const {tryRefreshTokens, user} = useUserContext();

    const [loadingState, setLoadingState] = useState<LoadingState>(CATEGORY_CONTEXT_INIT_STATE.loadingState);
    const [categories, setCategories] = useState<Category[]>(CATEGORY_CONTEXT_INIT_STATE.categories);
    const [chosenCategories, setChosenCategories] = useState<Category[]>(CATEGORY_CONTEXT_INIT_STATE.chosenCategories);

    useEffect(() => {
        if (user) {
            getCategories();
        } else {
            setChosenCategories([]);
        }
    }, [user]);

    const getCategories = () => {
        categoryService.getAll()
            .then(setCategories)
            .then(() => setLoadingState('SUCCESS'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    setTimeout(() => tryRefreshTokens().then(getCategories), 3000);
                } else {
                    setLoadingState('FAILURE');
                }
            });
    };

    const chooseCategories = (categories: Category[]) => {
        setChosenCategories(categories);
    };

    const getRandom = () => chosenCategories.length === 0
        ? undefined
        : chosenCategories[Math.floor(Math.random() * chosenCategories.length)];

    return (
        <CategoryContext.Provider
            value={{loadingState, categories, chosenCategories, getRandom, getCategories, chooseCategories}}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategoryContext = () => useContext(CategoryContext);
