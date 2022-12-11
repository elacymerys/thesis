import {createContext, FC, useContext, useEffect, useState} from "react";
import {useUserContext} from "./UserContext";

type QuizContextType = {
    chosenKey: string,
    chooseKey: (key: string) => void,
};

const QUIZ_CONTEXT_INIT_STATE: QuizContextType = {
    chosenKey: '',
    chooseKey: () => {}
};

const QuizContext = createContext<QuizContextType>(QUIZ_CONTEXT_INIT_STATE);

export const QuizContextProvider: FC = ({ children }) => {

    const { user } = useUserContext();
    const [chosenKey, setChosenKey] = useState<string>(QUIZ_CONTEXT_INIT_STATE.chosenKey);

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
        <QuizContext.Provider value={{ chosenKey, chooseKey}}>
            {children}
        </QuizContext.Provider>
    )
};

export const useQuizContext = () => useContext(QuizContext);
