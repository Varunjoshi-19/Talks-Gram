import React, { MutableRefObject, useRef } from 'react';

interface ElementContextPayload {

    menuOptionRef: MutableRefObject<HTMLDivElement | null>;

}



export const ElementContext = React.createContext<ElementContextPayload | undefined>(undefined);

export function useElementContext() {
    const context = React.useContext(ElementContext);
    if (!context) {
        throw new Error("useElementContext must be used within an ElementProvider");
    }
    return context;
}


export const ElementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const menuOptionRef = useRef<HTMLDivElement>(null);


    return (
        <ElementContext.Provider value={{ menuOptionRef }}>
            {children}
        </ElementContext.Provider>
    );
}

