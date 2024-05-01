import {
  useState,
  useContext,
  createContext,
  SetStateAction,
  Dispatch,
} from "react";

const VisibleTimeFramesContext = createContext<string | undefined>(undefined);
const UpdateVisibleTimeFramesContext = createContext<
  Dispatch<SetStateAction<string | undefined>>
>((_value) => {});

export const useVisibleTimeFramesContext = () => {
  return useContext(VisibleTimeFramesContext);
};

export const useUpdateVisibleTimeFramesContext = () => {
  return useContext(UpdateVisibleTimeFramesContext);
};

export const VisibleTimeFramesProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [visibleTimeFrames, setVisibleTimeFrames] = useState<
    string | undefined
  >(undefined);
  return (
    <VisibleTimeFramesContext.Provider value={visibleTimeFrames}>
      <UpdateVisibleTimeFramesContext.Provider value={setVisibleTimeFrames}>
        {children}
      </UpdateVisibleTimeFramesContext.Provider>
    </VisibleTimeFramesContext.Provider>
  );
};
