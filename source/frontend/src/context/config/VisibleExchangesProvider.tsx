import type {
  Dispatch,
  SetStateAction} from "react";
import {
  createContext,
  useContext,
  useState,
} from "react";

import { emptyValueFunction } from "../../helpers/helpers";

const VisibleExchangesContext = createContext<string | undefined>(undefined);
const UpdateVisibleExchangesContext = createContext<
  Dispatch<SetStateAction<string | undefined>>
>(emptyValueFunction);

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
