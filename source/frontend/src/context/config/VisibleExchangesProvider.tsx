import {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";

const VisibleExchangesContext = createContext<string | undefined>(undefined);
const UpdateVisibleExchangesContext = createContext<
  Dispatch<SetStateAction<string | undefined>>
>((_value) => {});

export const useVisibleExchangesContext = () => {
  return useContext(VisibleExchangesContext);
};

export const useUpdateVisibleExchangesContext = () => {
  return useContext(UpdateVisibleExchangesContext);
};

export const VisibleExchangesProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [visibleExchanges, setVisibleExchanges] = useState<string | undefined>(
    undefined
  );
  return (
    <VisibleExchangesContext.Provider value={visibleExchanges}>
      <UpdateVisibleExchangesContext.Provider value={setVisibleExchanges}>
        {children}
      </UpdateVisibleExchangesContext.Provider>
    </VisibleExchangesContext.Provider>
  );
};
