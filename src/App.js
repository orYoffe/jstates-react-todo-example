import React, { Component } from "react";
import { State, subscribe } from "jstates-react";
import "./App.css";

const todoState = new State("todoState", {
  todoItems: [
    { index: 1, value: "learn react", done: false },
    { index: 2, value: "Go shopping", done: true },
    { index: 3, value: "buy flowers", done: true }
  ]
});

const TodoHeader = () => <h1>Todo list</h1>;

const addItem = todoItem => {
  const todoItems = todoState.state.todoItems.slice();
  todoItems.unshift({
    index: todoItems.length + 1,
    value: todoItem.newItemValue,
    done: false
  });
  todoState.setState({ todoItems });
};

const removeItem = itemIndex => {
  const todoItems = todoState.state.todoItems.slice();
  todoItems.splice(itemIndex, 1);
  todoState.setState({ todoItems });
};
const markTodoDone = itemIndex => {
  const todoItems = todoState.state.todoItems.slice();
  const todo = todoItems[itemIndex];
  todoItems.splice(itemIndex, 1);
  todo.done = !todo.done;
  todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
  todoState.setState({ todoItems: todoItems });
};

const TodoList = props => {
  const items = props.items.map((item, index) => {
    return <TodoListItem key={index} item={item} index={index} />;
  });
  return <ul className="list-group"> {items} </ul>;
};
const TodoListWithItems = subscribe(TodoList, [todoState], ({ todoState }) => ({
  items: todoState.todoItems
}));

class TodoListItem extends Component {
  onClickClose = () => {
    const index = parseInt(this.props.index);
    removeItem(index);
  };
  onClickDone = () => {
    const index = parseInt(this.props.index);
    markTodoDone(index);
  };
  render() {
    const todoClass = this.props.item.done ? "done" : "undone";
    return (
      <li className="list-group-item ">
        <div className={todoClass}>
          <span
            className="glyphicon glyphicon-ok icon"
            aria-hidden="true"
            onClick={this.onClickDone}
          ></span>
          {this.props.item.value}
          <button type="button" className="close" onClick={this.onClickClose}>
            X
          </button>
        </div>
      </li>
    );
  }
}

class TodoForm extends Component {
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit = event => {
    event.preventDefault();
    const newItemValue = this.refs.itemName.value;

    if (newItemValue) {
      addItem({ newItemValue });
      this.refs.form.reset();
    }
  };
  render() {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="form-inline">
        <input
          type="text"
          ref="itemName"
          className="form-control"
          placeholder="add a new todo..."
        />
        <button type="submit" className="btn btn-default">
          Add
        </button>
      </form>
    );
  }
}

class TodoApp extends Component {
  render() {
    return (
      <div id="main">
        <TodoHeader />
        <TodoListWithItems />
        <TodoForm />
      </div>
    );
  }
}

export default TodoApp;
