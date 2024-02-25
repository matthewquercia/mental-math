import { useState, useEffect, useReducer, useRef } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const inputRef = useRef(null);
  const [state, setState] = useReducer((state, newState) => ({...state, ...newState}),
    {
      expression: null,
      input: "",
      numberOfQuestions: 5,
      currentQuestion: 0,
      inputState: "disabled",
      questions: [],
      number1: 1,
      number2: 1,
      operations: ['+','-','x','/'],
      error: null,
      checkStatePlus: true,
      checkStateMinus: true,
      checkStateMultiply: true,
      checkStateDivide: true,
    }
  )

  useEffect(() => {
    validateAnswer();
  }, [state.input])

  useEffect(() => {
    inputRef.current.focus(); //focuses the input once the game is started
  }, [state.inputState])

  const addRemoveOperations = (e) => {
    let arr = state.operations
    if(e.target.checked){
      arr.push(e.target.value);
      if(e.target.value === '+') setState({operations: arr, checkStatePlus: true});
      if(e.target.value === '-') setState({operations: arr, checkStateMinus: true});
      if(e.target.value === 'x') setState({operations: arr, checkStateMultiply: true});
      if(e.target.value === '/') setState({operations: arr, checkStateDivide: true});
    } else {
      arr.splice(arr.indexOf(e.target.value), 1);
      if(e.target.value === '+') setState({operations: arr, checkStatePlus: false});
      if(e.target.value === '-') setState({operations: arr, checkStateMinus: false});
      if(e.target.value === 'x') setState({operations: arr, checkStateMultiply: false});
      if(e.target.value === '/') setState({operations: arr, checkStateDivide: false});
    }
  }

  const generateExpression = () => {
    if(state.operations.length === 0){
      setState({error: "Select at least one operation"});
      return;
    }

    let minNum1,maxNum1,minNum2,maxNum2;

    let ops = state.operations;
    if(state.number1 === 1){
      minNum1 = 1
      maxNum1 = 9
    } else if(state.number1 === 2){
      minNum1 = 10
      maxNum1 = 99
    } else if(state.number1 === 3){
      minNum1 = 100
      maxNum1 = 999
    }

    if(state.number2 === 1){
      minNum2 = 1
      maxNum2 = 9
    } else if(state.number2 === 2){
      minNum2 = 10
      maxNum2 = 99
    } else if(state.number2 === 3){
      minNum2 = 100
      maxNum2 = 999
    }

    let num1 = Math.floor(Math.random() * (maxNum1 - minNum1 + 1) + minNum1);
    let num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1) + minNum2);
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

      if(state.currentQuestion === state.numberOfQuestions){
        resetGame();
      }
    }
  }

  const validateInput = (e) => {
    setState({input: e.target.value});
  }

  const resetGame = () => {
    //window.location.reload();
    setState({
      expression: null, 
      input: "", 
      numberOfQuestions: 5, 
      currentQuestion: 0, 
      inputState: "disabled",
      questions: [],
      number1: 1,
      number2: 1,
      operations: ['+','-','x','/'],
      error: null,
      checkStatePlus: true,
      checkStateMinus: true,
      checkStateMultiply: true,
      checkStateDivide: true,
    });
  }

  return (
    <div className="container">
      <h1>Mental Math Trainer</h1>
      {state.error && <p>{state.error}</p>}
      <div>
        {state.expression ? <meter min="0" max={state.numberOfQuestions} low="0" value={state.currentQuestion}/> : 
        <div>
          <div className="controls">
          <select value={state.number1} onChange={(e) => setState({number1: parseInt(e.target.value)})}>
              <option value="0" disabled selected>Digits</option>
              <option value="1" >1</option>
              <option value="2" >2</option>
              <option value="3" >3</option>
            </select>
              <div className="OpDiv">
                <label className="OpLabel">+</label><input className="OpLabel form-check-input" type="checkbox" checked={state.checkStatePlus} value="+" onChange={(e) => addRemoveOperations(e)}/>
                <label className="OpLabel">-</label><input className="OpLabel form-check-input" type="checkbox" checked={state.checkStateMinus} value="-" onChange={(e) => addRemoveOperations(e)}/>
                <label className="OpLabel">x</label><input className="OpLabel form-check-input" type="checkbox" checked={state.checkStateMultiply} value="x" onChange={(e) => addRemoveOperations(e)}/>
                <label className="OpLabel">/</label><input className="OpLabel form-check-input" type="checkbox" checked={state.checkStateDivide} value="/" onChange={(e) => addRemoveOperations(e)}/>
              </div>
            <select value={state.number2} onChange={(e) => setState({number2: parseInt(e.target.value)})}>
              <option value="0" disabled selected>Digits</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <label className="OpLabel">Amt of problems:</label><input style={{width: 50, textAlign: 'center', marginTop: 2}} value={state.numberOfQuestions} type="number" placeholder="Problems" onChange={(e) => setState({numberOfQuestions: parseInt(e.target.value)})}/>
        </div>
      }
      </div>
      <div>
        {!state.expression ? <button className="btn btn-primary customButton" onClick={() => generateExpression()}>Start</button> : <label className="expressionLabel customButton">{state.expression[0]} {state.expression[1]} {state.expression[2]}</label> }
      </div>
      <input ref={inputRef} inputMode="numeric" type="text" disabled={state.inputState} className="inputField" value={state.input} onChange={(e) => validateInput(e)}/>
      <br />
      <button onClick={() => resetGame()} className="customButton btn btn-danger">Reset</button>
      {state.questions && state.questions.map(expression => <p key={state.questions.indexOf(expression)}>{expression}</p>)}
    </div>
  );
}

export default App;
