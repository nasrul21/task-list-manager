import React, { PureComponent } from 'react';
import taskStore from './taskStore';
import './App.css';

class BaseComponent extends PureComponent {
  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }
}

class App extends BaseComponent {

  state = {
    initialize: false,
    inputTask: { text: "", done: false },
  }

  inputElement = React.createRef();

  async componentDidMount() {
    taskStore.setName("efishery_tasks");
    await taskStore.initialize();
    this.setState({ initialize: true });
    this.inputElement.current.focus();

    this.unsubTask = taskStore.subscribe(this.rerender)
  }

  async componentDidUpdate() {
    if(!taskStore.isInitialized) {
      console.log('popup initialize all offline data...');
      taskStore.setName("efishery_tasks");
      await taskStore.initialize();
      this.setState({ initialize: true });
      console.log('popup done');
    }
  }

  componentWillUnmount() {
    this.unsubTask();
  }

  handleInput = (event) => {
    this.setState({ inputTask: { text: event.target.value, done: false }});
  }

  addItem = async(event) => {
    event.preventDefault();
    const text = this.state.inputTask.text;
    if(text.trim() !== "") {
      console.log(this.state.inputTask);
      await taskStore.addItem(this.state.inputTask);
      this.setState({ inputTask: { text: "", done: false } });
    }
  }

  checkIsUploaded = (taks) => {
    return taskStore.checkIsUploaded(taks) ? "online" : "offline";
  }

  renderItem() {
    return taskStore.data.map((item) => (
        <li key={item._id} className={`${this.checkIsUploaded(item)} ${item.done ? 'checked' : ''}`}>
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
        <form className="header" onSubmit={this.addItem}>
          <h2>Task List Manager</h2>
          <input 
            type="text" 
            placeholder="Title..." 
            ref={this.inputElement}
            value={this.state.inputTask.text} 
            onChange={this.handleInput} />
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