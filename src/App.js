import React from 'react';
import './App.css';

class App extends React.Component {

  state = {
    tasks: [
      { text: "Bangun", done: true },
      { text: "Sahur", done: true },
      { text: "Masak", done: false },
      { text: "Makan", done: false },
      { text: "Beres-beres", done: false },
      { text: "Ibadah", done: false }
    ]
  }

  renderItem() {
    return this.state.tasks.map((item) => (
        // <li className={item.done ? "checked" : ""}>
        //   <span className="item-content">{item.text}</span>
        //   <span className="item-action">
        //     <button className="btn green">Done</button>
        //   </span>
        // </li>
        <li className={"online ${item.done ? 'checked' : ''}"}>
          {item.text}
          <span className="action">
            <button className="btn green">Done</button>
            <button className="btn blue">Edit</button>
            <button className="btn red">X</button>
          </span>
        </li>
    ))
  }

  render() {
    return (
      <div className="App">      
        <form className="header">
          <h2>Task List Manager</h2>
          <input type="text" id="myInput" placeholder="Title..." />
          <button type="submit" className="btn addBtn">Add</button>
        </form>

        <ul>
          {this.renderItem()}
        </ul> 
      </div>
    );
  }
}

export default App;