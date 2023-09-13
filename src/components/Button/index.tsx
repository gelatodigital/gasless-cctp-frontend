import { ReactComponent as Cross } from '../../icons/cross.svg';
import { ReactComponent as Check } from '../../icons/check.svg';
import Spinner from '../Spinner';
import './style.css';

export enum State {
  Pending,
  Success,
  Failed,
}
  
export interface Status {
  state: State;
  message: string;
}

interface ButtonProps {
  status?: Status | null;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Button = ({ children, status, onClick }: ButtonProps) => {
  const state = status?.state;
  const pending = state === State.Pending;

  return (
    <div className='button'>
      { !!status && (
        <div className='status'>
          <span className='icon'>
            { state === State.Failed && <Cross /> }
            { state === State.Success && <Check /> }
            { state === State.Pending && <Spinner /> }
          </span>
          <span>{ status?.message }</span>
        </div>
      )}
      <button disabled={ pending } onClick={ onClick }>{ pending ? 'Pending...' : children }</button>
    </div>
  );
};
