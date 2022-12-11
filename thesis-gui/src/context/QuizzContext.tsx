import {createContext, FC, useContext, useEffect, useState} from "react";
import {useUserContext} from "./UserContext";

type QuizzContextType = {
    chosenKey: string,
    chooseKey: (key: string) => void,
};

const QUIZZ_CONTEXT_INIT_STATE: QuizzContextType = {
    chosenKey: '',
    chooseKey: () => {}
};

const QuizzContext = createContext<QuizzContextType>(QUIZZ_CONTEXT_INIT_STATE);

export const QuizzContextProvider: FC = ({ children }) => {

    const { user } = useUserContext();
    const [chosenKey, setChosenKey] = useState<string>(QUIZZ_CONTEXT_INIT_STATE.chosenKey);

    useEffect(() => {
        if (user) {
        } else {
            setChosenKey('');
        }
    }, [user]);

    const chooseKey = (key: string) => {
        setChosenKey(key);
    };

    return (
        <QuizzContext.Provider value={{ chosenKey, chooseKey}}>
            {children}
        </QuizzContext.Provider>
    )
};

export const useQuizzContext = () => useContext(QuizzContext);
