import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // hook
  const [value, setValue] = useState("");
  const [todo, setTodo] = useState([]);

  // using useEffect so that data not be lost afer refreshing from page
  useEffect(function () {
    const request = new XMLHttpRequest();

    request.open("GET", "http://localhost:8000/getdata");
    request.send();

    request.addEventListener("load", function () {
      if (request.status === 200) {
        setTodo(JSON.parse(request.responseText));
      } else {
        console.log("something went wrong");
      }
    });
  }, []);

  // function when press enter

  function checkkey(e) {
    // checking when enter key is pressed
    if (e.key === "Enter") {
      console.log(`enter is pressed`);
      const request = new XMLHttpRequest();

      request.open("POST", "http://localhost:8000/save");
      request.setRequestHeader("Content-Type", "application/json");
      request.send(
        JSON.stringify({ text: value, id: Math.trunc(Math.random() * 1000) })
      );

      request.addEventListener("load", function () {
        if (request.status === 200) {
          setTodo([
            ...todo,
            { text: value, id: Math.trunc(Math.random() * 1000) },
          ]);
          setValue("");
        } else {
          console.log("something went wrong");
        }
      });
    }
  }

  function savetodo(e) {
    setValue(e.target.value);
  }

  //strike off task from todo
  function strike(e) {
    let arr = todo.map((element) => {
      if (element.id === e) {
        element.text = <strike>{element.text}</strike>;
      }
      return element;
    });
    console.log(arr);
    setTodo(arr);
  }

  //delete task
  function del(e) {
    let arr = todo.filter((element) => {
      if (element.id !== e) return true;
    });
    setTodo(arr);
    console.log(arr);
    const request = new XMLHttpRequest();

    request.open("POST", "http://localhost:8000/update");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(arr));
  }

  return (
    <div>
      <div className="container">
        <div className="display">
          <h1>Task List</h1>
          <p>
            Add Task to your list by typing to the right and pressing enter. You
            may then view the pending task below.
          </p>
          <ul className="todo">
            {todo.map(function (element, index) {
              return (
                <div key={index} className="list">
                  <p className="td1" id={element.id} key={index}>
                    {element.text}
                  </p>
                  <button onClick={() => del(element.id)}>🗑️</button>
                  <button onClick={() => strike(element.id)} className="td2">
                    ❌
                  </button>
                </div>
              );
            })}
          </ul>
        </div>
        <div className="type">
          <input
            autoComplete="off"
            onChange={savetodo}
            onKeyDown={checkkey}
            value={value}
            id="inp"
            placeholder="I need to......."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
