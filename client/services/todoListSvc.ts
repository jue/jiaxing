import BaseSvc from './BaseSvc';
import qs from 'querystring';
import axios from 'axios';

import { DBAccountI } from '../../typings/account';

class TodoListSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api';
  }

  async searchTodos(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await axios.get(`/tylinsh/approval/todos?${queryString}`);
    return data;
  }
  async searchTodo(params: any) {
    const { data } = await axios.get(`/tylinsh/approval/todo/${params}`);
    return data;
  }
  async todos(params: any) {
    const queryString = qs.stringify(params);
    const { data } = await this.api.get(`/todos?${queryString}`);
    return data;
  }
}

const todoListSvc = new TodoListSvc();

export default todoListSvc;
