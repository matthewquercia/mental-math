import { useState, useEffect, useReducer, useRef } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const inputRef = useRef(null);
  const [state, setState] = useReducer((state, newState) => ({...state, ...newState}),
    {
      expression: null,
      input: "",
      numberOfQuestion: 5,
      currentQuestion: 0,
      inputState: "disabled",
      questions: []
    }
  )

  useEffect(() => {
    validateAnswer();
  }, [state.input])

  useEffect(() => {
    inputRef.current.focus(); //focuses the input once the game is started
  }, [state.inputState]) 

  const generateExpression = () => {
    let ops = ['+', '-', "x", '/'];
    let num1 = Math.floor(Math.random() * (12) + 1);
    let num2 = Math.floor(Math.random() * (12) + 1);
    let operation = ops[Math.floor(Math.random() * ops.length)];

    if(operation === '/'){
      const factors = Array.from(Array(num1 + 1), (_, i) => i).filter(i => num1 % i === 0);
      num2 = factors[Math.floor(Math.random() * factors.length)];
      console.log(factors);
    }

    let arr = num1 > num2 ? [num1, operation, num2] : [num2, operation, num1];

    setState({expression: arr, inputState: ""});
  }

  const validateAnswer = () => {
    if(state.expression !== null){
      let ans;
      if(state.expression[1] === '+') ans = state.expression[0] + state.expression[2];
      if(state.expression[1] === '-') ans = state.expression[0] - state.expression[2];
      if(state.expression[1] === 'x') ans = state.expression[0] * state.expression[2];
      if(state.expression[1] === '/') ans = state.expression[0] / state.expression[2];

      if(ans === parseInt(state.input)){
        generateExpression();
        setState({input: "", currentQuestion: state.currentQuestion += 1, questions: [...state.questions, `${state.expression[0]} ${state.expression[1]} ${state.expression[2]} = ${ans}`]});
      }

      if(state.currentQuestion === state.numberOfQuestion){
        resetGame();
      }
    }
  }

  const validateInput = (e) => {
    setState({input: e.target.value});
  }

  const resetGame = () => {
    setState({
      expression: null, 
      input: "", 
      numberOfQuestion: 10, 
      currentQuestion: 0, 
      inputState: "disabled",
      questions: []
    });
  }

  return (
    <div className="container">
      <h1>Mental Math Trainer</h1>
      <div>
        {state.expression && <meter min="0" max={state.numberOfQuestion} low="0" value={state.currentQuestion}/>}
      </div>
      <div className="customButton">
        {!state.expression ? <button className="btn btn-primary" onClick={() => generateExpression()}>Start</button> : <label>{state.expression[0]} {state.expression[1]} {state.expression[2]}</label> }
      </div>
      <input ref={inputRef} type="text" disabled={state.inputState} className="inputField" value={state.input} onChange={(e) => validateInput(e)}/>
      <br />
      <button onClick={() => resetGame()} className="customButton btn btn-danger">Reset</button>
      {state.questions && state.questions.map(expression => <p key={state.questions.indexOf(expression)}>{expression}</p>)}
    </div>
  );
}

export default App;
