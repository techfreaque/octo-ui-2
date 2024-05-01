import {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";

const VisiblePairsContext = createContext<string | undefined>(undefined);
const UpdateVisiblePairsContext = createContext<
  Dispatch<SetStateAction<string | undefined>>
>((_value) => {});

export const useVisiblePairsContext = () => {
  return useContext(VisiblePairsContext);
};

export const useUpdateVisiblePairsContext = () => {
  return useContext(UpdateVisiblePairsContext);
};

export const VisiblePairsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [visiblePairs, setVisiblePairs] = useState<string | undefined>(
    undefined
  );
  return (
    <VisiblePairsContext.Provider value={visiblePairs}>
      <UpdateVisiblePairsContext.Provider value={setVisiblePairs}>
        {children}
      </UpdateVisiblePairsContext.Provider>
    </VisiblePairsContext.Provider>
  );
};
