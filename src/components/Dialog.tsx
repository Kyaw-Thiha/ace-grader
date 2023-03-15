import { createContext, ReactNode, useContext } from "react";

interface Props {
  id: string;
  openContainer?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
}

const Dialog: React.FC<Props> = (props) => {
  return (
    <>
      {props.openContainer}

      <input type="checkbox" id={props.id} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor={props.id}
            className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2 text-lg"
          >
            ✕
          </label>
          {props.body}

          <div className="modal-action mt-8">{props.actions}</div>
        </div>
      </div>
    </>
  );
};

// const ModalContext = createContext<Props | null>(null);

// const useModalContext = () => {
//   const context = useContext(ModalContext);
//   if (!context) {
//     throw new Error(
//       "ProductCard.* component must be rendered as child of ProductCard component"
//     );
//   }
//   return context;
// };

// const ModalOpenContainer: React.FC = () => {
//   const modalContext = useModalContext();
//   return <></>;
// };

// const ModalBody: React.FC<Props> = () => {
//   return <></>;
// };

// const ModalActionButton: React.FC<Props> = () => {
//   const modalContext = useModalContext();

//   return <></>;
// };

export default Dialog;
