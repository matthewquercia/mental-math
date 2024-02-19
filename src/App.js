import { useState, useEffect, useReducer } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  // const [expression, setExpression] = useState(null);
  // const [input, setInput] = useState("");

  const [state, setState] = useReducer((state, newState) => ({...state, ...newState}),
    {
      expression: null,
      input: "",
      numberOfQuestion: 5,
      currentQuestion: 0,
      inputState: "disabled"
    }
  )

  const generateExpression = () => {
    let ops = ['+', '-', "x"]
    let num1 = Math.floor(Math.random() * (10 - 1) + 1);
    let num2 = Math.floor(Math.random() * (10 - 1) + 1);
    let operation = ops[Math.floor(Math.random() * ops.length)];

    let arr = num1 > num2 ? [num1, operation, num2] : [num2, operation, num1];
    setState({expression: arr, inputState: ""});
  }

  const validateAnswer = () => {
    if(state.expression !== null){
      let ans;
      if(state.expression[1] === '+') ans = state.expression[0] + state.expression[2];
      if(state.expression[1] === '-') ans = state.expression[0] - state.expression[2];
      if(state.expression[1] === 'x') ans = state.expression[0] * state.expression[2];

      if(ans === parseInt(state.input)){
        generateExpression();
        setState({input: "", currentQuestion: state.currentQuestion += 1})
      }

      if(state.currentQuestion === state.numberOfQuestion){
        resetGame();
      }
    }
  }

  const validateInput = (e) => {
    setState({input: e.target.value});
  }

  useEffect(() => {
    validateAnswer();
  }, [state.input])

  const resetGame = () => {
    setState({expression: null, input: "", numberOfQuestion: 10, currentQuestion: 0, inputState: "disabled"});
  }

  return (
    <div className="container">
      <h1>Mental Math Trainer</h1>
      <div>
        <meter min="0" max={state.numberOfQuestion} low="0" value={state.currentQuestion}/>
      </div>
      <div className="customButton">
        {!state.expression ? <button className="btn btn-primary" onClick={() => generateExpression()}>Start</button> : <label>{state.expression[0]} {state.expression[1]} {state.expression[2]}</label>}
      </div>
      <input disabled={state.inputState} className="inputField" value={state.input} onChange={(e) => validateInput(e)}/>
      <br />
      <button onClick={() => resetGame()} className="customButton btn btn-danger">Reset</button>
    </div>
  );
}

export default App;
