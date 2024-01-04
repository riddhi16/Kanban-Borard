const bodyRef = document.querySelector("body");
const overlayRef = document.querySelector(".ov");
const addNewTaskBtn = document.querySelector(".nav-button");
const mainContainer = document.querySelector(".main-container");
// Form Inputs
const formRef = document.querySelector(".hideform");
const inputRef = document.querySelector(".input-area");
const prioritiesRef = document.querySelector(".prioritiesselect");
const taskRef = document.querySelector(".taskselect");
const tagsRef = document.querySelector(".tag-box");
const submitBtnRef = document.querySelector(".submitBtn");
//  Main Area Div
const todoTasksRef = document.querySelector("#todo .task-list");
const inProgressTasksRef = document.querySelector("#in-progress .task-list");
const inReviewTasksRef = document.querySelector("#in-review .task-list");
const doneTasksRef = document.querySelector("#done .task-list");

// Function Toggles hideform
function formopenclose() {
  formRef.classList.toggle("hideform");
  overlayRef.classList.toggle("overlay");
}

//Function to  generate a unique ID
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36
  const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string
  const uniqueId = timestamp + randomString; // Combine timestamp and random string
  return uniqueId;
}

// Funtion sets the form value to default after submitting the task
function setDefaultVal() {
  inputRef.value = " ";
  document.querySelector(`#critical`).selected = "true";
  document.querySelector(`#todo`).selected = "true";
  console.log(document.querySelector(`#todo`));
  tagsRef.value = " ";
  console.log("----------");
}
// Funtion to get the edit task values in the form
const setcurrentEditedTask = (taskID) => {
  const data = JSON.parse(localStorage.getItem(taskID))[0];
  console.log(data);
  inputRef.value = data.inputValue;
  prioritiesRef.value = data.priorityValue;
  taskRef.value = data.taskValue;
  if (data.tagvalue) {
    tagsRef.value = data.tagvalue;
  }
};
// Funtion gets data on submit and adds to loaclstorage
function setdata() {
  if (inputRef.value === "") {
    alert("data cant be empty");
    return;
  }

  const uniqueId = generateUniqueId();
  const tasks = [
    {
      inputValue: inputRef.value,
      priorityValue: prioritiesRef.value,
      taskValue: taskRef.value,
      uniqueIdvalue: uniqueId,
      ...(tagsRef.value ? { tagvalue: tagsRef.value } : {}),
    },
  ];
  const tasksjson = JSON.stringify(tasks);
  localStorage.setItem(`${uniqueId}`, tasksjson);
}
// Funtion updates the value in Locastorage
const updateLocalSg_values = (id) => {
  // Get existing tasks from localStorage
  const existingTasksJSON = localStorage.getItem(id);
  const existingTasks = existingTasksJSON ? JSON.parse(existingTasksJSON) : [];
  console.log(existingTasks);

  // Find the task with the specified id
  const taskIndex = existingTasks.findIndex(
    (task) => task.uniqueIdvalue === id
  );

  if (taskIndex !== -1) {
    // Update the values for the task
    existingTasks[taskIndex] = {
      ...existingTasks[taskIndex],
      inputValue: inputRef.value,
      priorityValue: prioritiesRef.value,
      taskValue: taskRef.value,
      ...(tagsRef.value ? { tagvalue: tagsRef.value } : {}),
    };
    // Step 4: Save the updated tasks array back to localStorage
    localStorage.setItem(id, JSON.stringify(existingTasks));
    renderTaskData();
  } else {
    alert("No data found");
  }
};
const updatePriorityInLocalStorage = (id, newTaskValue) => {
  // Get existing tasks from localStorage
  const existingTasksJSON = localStorage.getItem(id);
  const existingTasks = existingTasksJSON ? JSON.parse(existingTasksJSON) : [];

  // Find the task with the specified id
  const taskIndex = existingTasks.findIndex(
    (task) => task.uniqueIdvalue === id
  );

  if (taskIndex !== -1) {
    // Update only the priorityValue for the task, keeping other values unchanged
    const updatedTask = {
      ...existingTasks[taskIndex],
      taskValue: newTaskValue,
    };

    // Update the task in the array
    existingTasks[taskIndex] = updatedTask;
    console.log(existingTasks[taskIndex]);
    // Save the updated tasks array back to localStorage
    localStorage.setItem(id, JSON.stringify(existingTasks));
  }
};

const renderTaskData = () => {
  document.querySelectorAll(".task-list").forEach((taskList) => {
    taskList.innerHTML = "";
  });

  Object.entries(localStorage).forEach(([key, value]) => {
    const task = JSON.parse(value)[0];
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task");
    taskWrapper.setAttribute("data-id", `${key}`);
    taskWrapper.setAttribute("draggable", "true");
    taskWrapper.innerHTML = generateTaskItem(task);
    if (task.taskValue == "todo") {
      todoTasksRef.appendChild(taskWrapper);
    }
    if (task.taskValue == "inprogress") {
      inProgressTasksRef.appendChild(taskWrapper);
    }
    if (task.taskValue == "inreview") {
      inReviewTasksRef.appendChild(taskWrapper);
    }
    if (task.taskValue == "done") {
      doneTasksRef.appendChild(taskWrapper);
    }
  });

  document.querySelectorAll(".task-section").forEach((taskSection) => {
    const taskCount = taskSection.querySelector(".task-list").children.length;
    taskSection.querySelector(".task-count").innerHTML = taskCount;
  });
};

// returns the generated tasks
const generateTaskItem = (taskData) => {
  const { inputValue, priorityValue, tagvalue, taskValue, uniqueIdvalue } =
    taskData;
  let tagSection = ""; // Initialize an empty string

  // Check if tagvalue is defined
  if (tagvalue !== undefined) {
    // Include the tagvalue section in the HTML
    tagSection = `<div>
                      <p>${tagvalue}</p>
                    </div>`;
  }
  return `<div class="priority ${priorityValue}"></div>
            <div class="task-content">
              <div class="task-text">${inputValue}</div>
              <div class="task-footer">
                  <span><i class="fa fa-pencil-square-o edit-task"></i></span>
                  <span><i class="fa fa-trash-o delete-task"></i></span>
                  <span><i class="fa fa-hand-rock-o drag-task"></i></i></span>
              </div>
          </div>
          ${tagSection}
          `;
};

addNewTaskBtn.addEventListener("click", (e) => {
  formopenclose();
  // resetAddNewTaskMenu();
});

mainContainer.addEventListener("click", (e) => {
  // Delete task from localstorage and re-render all the tasks from LC
  if (e.target.classList.contains("delete-task")) {
    const del_task = e.target.closest(".task").getAttribute("data-id");
    localStorage.removeItem(del_task);
    renderTaskData();
  } else if (e.target.classList.contains("edit-task")) {
    const edit_task = e.target.closest(".task").getAttribute("data-id");
    submitBtnRef.setAttribute("edit-id", `${edit_task}`);
    formopenclose();
    submitBtnRef.classList.add("editing");
    submitBtnRef.classList.remove("submitBtn");

    // To be edited data is done at last as after the the "editing" class is added we also set the values to default
    setcurrentEditedTask(edit_task);
  }
});

mainContainer.addEventListener("dragstart", (e) => {
  let selected = e.target;
  selected.classList.add("dragging");
  // console.log(selected);
});

mainContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const selected = document.querySelector(".dragging");
  const isTaskList = e.target.closest(".task-list");
  if (isTaskList) {
    isTaskList.appendChild(selected);
  }
});

mainContainer.addEventListener("drop", (e) => {
  const selected = document.querySelector(".dragging");
  selected.classList.remove("dragging");
  const id = selected.getAttribute("data-id");
  const taskv = e.target.closest(".task-section").getAttribute("data-section");
  updatePriorityInLocalStorage(id, taskv);
  // console.log(id, taskv);
  renderTaskData();
});

formRef.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("closebtn") ||
    e.target.classList.contains("cancelBtn")
  ) {
    formopenclose();
    setDefaultVal();
  } else if (e.target.classList.contains("editing")) {
    submitBtnRef.classList.add("submitBtn");
    submitBtnRef.classList.remove("editing");
    const id = submitBtnRef.getAttribute("edit-id");
    updateLocalSg_values(id);
    formopenclose();
    setDefaultVal();
  } else if (e.target.classList.contains("submitBtn")) {
    setdata();
    formopenclose();
    setDefaultVal();
    renderTaskData();
  }
});

renderTaskData();
