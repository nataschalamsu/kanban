<template>
  <div class="hello">
    <div class="container-fluid">
      <!-- Trigger the modal with a button -->
      <div class="col" id="btn">
        <button type="button" class="btn btn-info btn-md" data-toggle="modal" data-target="#myModal">
          Add Task
        </button>
      </div>
      
      <!-- Modal -->
      <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">
        
          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">New Task</h4>
            </div>
            <div class="modal-body">
              <form class="form-horizontal" action="/action_page.php" id="TaskForm">
                <div class="form-group">
                  <label class="control-label col-sm-2" for="task">Task: </label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="task" placeholder="Write your task..." v-model="task.title">
                  </div>
                </div>
                <div class="form-group">
                 <label class="control-label col-sm-2" for="description">Description: </label>
                  <div class="col-sm-10">
                    <textarea class="form-control" id="description" rows="3" placeholder="Task description..." v-model="task.description">
                    </textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-2" for="assign">Assigned to: </label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="assign" placeholder="Assigned to..." v-model="task.assignedTo">
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success" @click="addTask" data-dismiss="modal">Submit</button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 col-md-3" id="backlog">
          <h3>Back Log</h3>
          <div class="col" v-for="(task, i) in taskList" :key="{i}" v-if="task.status === 'backlog'">
            <p>Title: {{ task.title }}</p>
            <p>Description: {{ task.description }}</p>
            <p>Assigned To: {{ task.assignedTo }}</p>
            <div class="col" id="btn">
            <button type="button" class="btn btn-info btn-md" data-toggle="modal" data-target="#editModal" @click="getKey(task)">
              Edit
            </button>
          </div>
          
          <!-- Modal -->
          <div class="modal fade" id="editModal" role="dialog">
            <div class="modal-dialog">
            
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Edit Task</h4>
                </div>
                <div class="modal-body">
                  <form class="form-horizontal" action="/action_page.php" id="TaskForm">
                    <div class="form-group">
                      <label class="control-label col-sm-2" for="editTask">Task: </label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" id="editTask" placeholder="Write your task..." v-model="updateTask.title">
                      </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="editDescription">Description: </label>
                      <div class="col-sm-10">
                        <textarea class="form-control" id="editDescription" rows="3" placeholder="Task description..." v-model="updateTask.description">
                        </textarea>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="control-label col-sm-2" for="editAssign">Assigned to: </label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" id="editAssign" placeholder="Assigned to..." v-model="updateTask.assignedTo">
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-success" @submit="editTask" data-dismiss="modal">Submit</button>
                </div>
              </div>
            </div>
          </div>
            <button type="button" class="btn btn-danger" @click="deleteTask(task)">Delete</button>
            <button type="button" class="btn btn-primary" @click="toTodo(task)">To Do</button>
          </div>
        </div>
        <div class="col-md-4 col-md-3" id="todo">
          <h3>To Do</h3>
          <div class="col" v-for="(task, i) in taskList" :key="{i}" v-if="task.status === 'todo'">
            <p>Title: {{ task.title }}</p>
            <p>Description: {{ task.description }}</p>
            <p>Assigned To: {{ task.assignedTo }}</p>
            <button type="button" class="btn btn-primary" @click="toDoing(task)">Doing</button>
          </div>
        </div>
        <div class="col-md-4 col-md-3" id="doing">
          <h3>Doing</h3>
          <div class="col" v-for="(task, i) in taskList" :key="{i}" v-if="task.status === 'doing'">
            <p>Title: {{ task.title }}</p>
            <p>Description: {{ task.description }}</p>
            <p>Assigned To: {{ task.assignedTo }}</p>
            <button type="button" class="btn btn-primary" @click="toDone(task)">Done</button>
          </div>
        </div>
        <div class="col-md-4 col-md-3" id="done">
          <h3>Done</h3>
          <div class="col" v-for="(task, i) in taskList" :key="{i}" v-if="task.status === 'done'">
            <p>Title: {{ task.title }}</p>
            <p>Description: {{ task.description }}</p>
            <p>Assigned To: {{ task.assignedTo }}</p>
            <button type="button" class="btn btn-danger" @click="deleteTask(task)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {db} from '@/firebase.js'

const tasks = db.ref('tasks')

export default {
  name: 'HelloWorld',
  data () {
    return {
      task: {
        title: '',
        description: '',
        assignedTo: '',
        status: 'backlog'
      },
      updateTask: {
        key: '',
        title: '',
        description: '',
        assignedTo: '',
        status: ''
      },
      taskList: []
    }
  },
  methods: {
    addTask () {
      tasks.push(this.task)
      this.getTasks()
    },
    getTasks () {
      let arrTask = []
      tasks.once('value')
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            let key = childSnapshot.key
            let childData = childSnapshot.val()
            childData.key = key
            arrTask.push(childData)
          })
          this.taskList = arrTask
        })
    },
    getKey (task) {
      console.log(task.status)
      this.updateTask.key = task.key
      this.updateTask.title = task.title
      this.updateTask.description = task.description
      this.updateTask.assignedTo = task.assignedTo
      this.updateTask.status = task.status
    },
    editTask () {
        const { 
          title, 
          description, 
          assignedTo
        } = this.updateTask
      db.ref(`tasks/${this.updateTask.key}`).update(
        {
          title,
          description,
          assignedTo
        }
      )
      this.getTasks()
    },
    deleteTask (task) {
      db.ref(`tasks/${task.key}`).remove()
      this.getTasks()
    },
    toTodo (task) {
      const {
        status
      } = this.updateTask
      db.ref(`tasks/${task.key}`).update({
        status: 'todo'
      })
      this.getTasks()
    },
    toDoing (task) {
      const {
        status
      } = this.updateTask
      db.ref(`tasks/${task.key}`).update({
        status: 'doing'
      })
      this.getTasks()
    },
    toDone (task) {
      const {
        status
      } = this.updateTask
      db.ref(`tasks/${task.key}`).update({
        status: 'done'
      })
      this.getTasks()
    }
  },
  created () {
    this.getTasks()
  },
  computed: {
    backlogList () {
      return this.taskList.filter(task => task.status === 'backlog')
    },
    todoList () {
      return this.taskList.filter(task => task.status === 'todo')
    },
    doingList () {
      return this.taskList.filter(task => task.status === 'doing')
    },
    doneList () {
      return this.taskList.filter(task => task.status === 'done')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

body {
  background-color: whitesmoke;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;;
}

#btn {
  border: none;
}

.col {
  border: 2px solid black;
  padding: 5px;
}

#backlog {
  border-right: 2px solid black;
  background-color: crimson;
}

#todo {
  background-color:deepskyblue;
}

#doing {
  background-color:yellow;
}

#done {
  background-color:lime;
}

h3 {
  margin: 40px 0 0;
}

a {
  color: #42b983;
}
</style>
