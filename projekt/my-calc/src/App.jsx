import { useReducer, useEffect } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import explosionGif from "./assets/explosion.gif";
import explosionSoundFile from './assets/exsound.mp3';
import clickSoundFile from './assets/click.mp3';
import equalsSoundFile from './assets/equals.mp3';
import Decimal from 'decimal.js';

const clickSound = new Audio(clickSoundFile);
const equalsSound = new Audio(equalsSoundFile);

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.error) {
        return {
          ...state,
          error: null,
          gifShown: false,
          currentOperand: action.payload.digit,
        };
      }
      if (state.overwrite) {
        clickSound.play();
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (action.payload.digit === "." && state.currentOperand == null) {
        clickSound.play();
        return {
          ...state,
          currentOperand: `0.`,
        };
      }
      if (action.payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      clickSound.play();
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.error) {
        return {
          ...state,
          error: null,
          gifShown: false,
        };
      }
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        clickSound.play();
        return {
          ...state,
          operation: action.payload.operation,
        };
      }
      if (state.previousOperand == null) {
        clickSound.play();
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      if (state.operation === "÷" && Math.abs(parseFloat(state.currentOperand)) < Number.EPSILON) {
        clickSound.play();
        return {
          ...state,
          error: "division-by-zero",
          gifShown: true,
        };
      }
      clickSound.play();
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      if (!state.error) {
        clickSound.play();
      }
      return { error: null, gifShown: false };
    case ACTIONS.DELETE_DIGIT:
      clickSound.play();
      if (state.error) {
        return {
          ...state,
          error: null,
          gifShown: false,
        };
      }
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }
      if (state.operation === "÷" && Math.abs(parseFloat(state.currentOperand)) < Number.EPSILON) {
        return {
          ...state,
          error: "division-by-zero",
          gifShown: true,
        };
      }
      equalsSound.play()
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = Decimal(prev).add(Decimal(current));
      break;
    case "-":
      computation = Decimal(prev).sub(Decimal(current));
      break;
    case "*":
      computation = Decimal(prev).times(Decimal(current));
      break;
    case "÷":
      computation = Decimal(prev).div(Decimal(current));
      break;
    default:
      return "";
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  const formattedInteger = INTEGER_FORMATTER.format(integer).replace(/,/g, " ");
  if (decimal == null) return formattedInteger;
  return `${formattedInteger}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation, error, gifShown }, dispatch] = useReducer(reducer, { gifShown: false });

  useEffect(() => {
    if (error && gifShown) {
      const exaudio = new Audio(explosionSoundFile);
      exaudio.play();
      const timer = setTimeout(() => {
        dispatch({ type: ACTIONS.CLEAR });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [error, gifShown]);

  return (
    <div className="calculator-grid">
      <div className="output">
        {error && gifShown ? (
          <img src={explosionGif} alt="Explosion" className="explosion-gif" />
        ) : (
          <>
            <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
            <div className="current-operand">{formatOperand(currentOperand)}</div>
          </>
        )}
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>&lt;</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
    </div>
  );
}

export default App;