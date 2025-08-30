import { useContext, createContext, useState, ReactNode } from "react";

type ToogleContextType = {

    searchBarVisible: boolean;
    searchInput : string;
    toogleVisiblility: (v : boolean) => void;
    setSearchInput : (v : string)  => void;
    newUserToogled : string | null;
    setNewUserToogled : React.Dispatch<React.SetStateAction<string| null>>;

}


const ToogleContext = createContext<ToogleContextType | undefined>(undefined);


export const ToggleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [searchBarVisible, setSearchBarVisible] = useState<boolean>(false);
    const [newUserToogled  , setNewUserToogled]  = useState<string | null>(null); 
    const [searchInput , setSearchInput] = useState<string>("");

    function toogleVisiblility(value: boolean) {
        setSearchBarVisible(value);
    }

    return (

        <ToogleContext.Provider value={{ searchBarVisible, toogleVisiblility , searchInput , 
         setNewUserToogled , newUserToogled,
        setSearchInput }}>
            {children}
        </ToogleContext.Provider>

    )

}

export const useToogle = (): ToogleContextType => {

    const context = useContext(ToogleContext);
    if (!context) {
        throw new Error("useToogle must be used within a Toogle provider")
    }

    return context;

}