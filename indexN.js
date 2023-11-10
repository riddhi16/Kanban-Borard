const wrapperdivRef = document.querySelector("#wrapperDiv");
const wrapperdivcontentRef = document.querySelector("#wrapperDivcontent");
const openformRef = document.querySelector(".Oform");
const submitbtnRef = document.querySelector(".submitBtn");
const inputRef = document.querySelector(".inputarea");
const prioritiesRef = document.querySelector("#priorities");
const tasdefRef = document.querySelector("#taskdef");
const newTodoRef = document.querySelector(".newTodo");
const inProgressRef = document.querySelector(".inProgress");
const inReviewRef = document.querySelector(".inReview");
const completedTaskRef = document.querySelector(".completedTask");
const elements = document.getElementsByClassName("fa-hand-rock-o");
const mainBoardRef = document.querySelector(".mainBoardArea");


// mainBoardRef.addEventListener("dragstart", handleDragStart);
// mainBoardRef.addEventListener("dragend",handleDrop);
// mainBoardRef.addEventListener("dragover",eventhover);

// function eventhover(event){
//    const getTaskCategory = event.target.closest('.inReview, .inProgress,.newTodo,.completedTask');
//     var getTaskCategoryName = '';
//     if(getTaskCategory){
//         getTaskCategoryName = getTaskCategory.className;
//         getTaskCategoryName = getTaskCategoryName.replace('width25','');
//         console.log(getTaskCategoryName);
//     }
//     return getTaskCategoryName;
// }
// function handleDragStart(event) {
//     const draggedElement = event.target;
// }
// function handleDrop(event){
//     const dropelement = event.target;
// }

// Add this event handler to handle the dragstart event
// function handleDragStart(event) {

//     // const draggedelement = event.target.closest('.taskcontent').getAttribute("data-uniqueID");
//     // // draggedelement.
//     // event.dataTransfer.setData("text/plain", event.target.dataset.draggedelement);

//     const draggedElement = event.target.closest('.taskcontent');
//     const dataUniqueId = draggedElement.getAttribute("data-uniqueID");
//     event.dataTransfer.setData("text/plain", dataUniqueId);
//     console.log(dataUniqueId);
// }

// // Add this event handler to handle the dragover event
// mainBoardRef.addEventListener("dragover", eventhover);

// function eventhover(event) {
//     event.preventDefault(); // Allow drop
//     const targetCategory = event.target.closest('.inReview, .inProgress, .newTodo, .completedTask');
//     const targetUniqueId = event.target.dataset.uniqueID;
//     // Check if the dragged element can be dropped onto the target
//     console.log(targetCategory);
//     console.log(targetUniqueId);

//     if (targetCategory && targetUniqueId) {
//         event.dataTransfer.dropEffect = "move";
//     } else {
//         event.dataTransfer.dropEffect = "none";
//     }
// }

// // Add this event handler to handle the dragend event
// mainBoardRef.addEventListener("dragend", handleDragEnd);

// function handleDragEnd(event) {
//     event.preventDefault();
//     const targetCategory = event.target.closest('.inReview, .inProgress, .newTodo, .completedTask');
//     const targetUniqueId = event.target.dataset.uniqueID;
//     // Check if the dragged element can be dropped onto the target
//     if (targetCategory && targetUniqueId) {
//         const draggedUniqueId = event.dataTransfer.getData("text/plain");
//         // You have the unique IDs of the dragged and target elements, you can now update their positions
//         // For example, you can update the 'taskdefValue' of the dragged element to match the 'targetCategory'
//     }
// }

wrapperdivRef.addEventListener("click", function (e) {
    if (e.target.classList.contains("addbtn")) {
        formopenclose(e.target);
        setDefaultVal()
    }else if(e.target.classList.contains("submitBtn")){
        functionsetdata();
        formopenclose(e.target);
    }else if(e.target.classList.contains("icon-trash")){
        const data = e.target.parentNode.parentNode.dataset.uniqueid;
        localStorage.removeItem(`${data}`);
        removeDeletedTask(data); 
    }
    else if(e.target.classList.contains("closebtn")){
        formopenclose(e.target);
        setDefaultVal();
    }else if(e.target.classList.contains("icon-pen")){
        const data = e.target.parentNode.parentNode.dataset.uniqueid;
        const dataitem =  localStorage.getItem(`${data}`);
        formopenclose(e.target,dataitem);
    }
});


function formopenclose(target,dataitem) {
    if(dataitem){
        const data = JSON.parse(dataitem)[0];
        console.log(data.uniqueIdvalue);
        if(target.classList.contains("icon-pen")){
            inputRef.value = data.inputValue;
            document.querySelector(`#${data.priorityValue}`).selected="true";
            document.querySelector(`#${data.taskdefValue}`).selected = "true";
            inputRef.setAttribute("data-id",`${data.uniqueIdvalue}`);
        } 
       
    }
    if(target.classList.contains("submitBtn")){
        const inputRefAttribute =  inputRef.getAttribute("data-id");  
        console.log(inputRefAttribute);  
        // update the data while Editing
        if(inputRefAttribute){
        localStorage.removeItem(`${inputRefAttribute}`);
        removeDeletedTask(inputRefAttribute); 
        }
    }
  
    wrapperdivcontentRef.classList.toggle('opacity');
    openformRef.classList.toggle('hideform');
}

function removeDeletedTask(data) {
    const deletedEle = document.querySelector(`div[data-uniqueid="${data}"]`);
    deletedEle.remove();
}
function functionsetdata() {
    const uniqueId = generateUniqueId();
    const tasks = [
        {
            inputValue: inputRef.value,
            priorityValue: prioritiesRef.value,
            taskdefValue: tasdefRef.value,
            uniqueIdvalue: uniqueId
        }
    ];
    const taskSJSON = JSON.stringify(tasks);
    if(inputRef.value === ""){
        alert("data cant be empty");
    }else{
        localStorage.setItem(`${uniqueId}`, taskSJSON);
        appendDiv(taskSJSON);
        // setDefaultVal();
    }
}


function appendDiv(taskJson){
    const taskData = JSON.parse(taskJson)[0];
    if(taskData.inputValue != " "){
        const arrowfn = myArrowFunction(taskData.inputValue, taskData.priorityValue, taskData.taskdefValue, taskData.uniqueIdvalue);
        if (taskData.taskdefValue === 'todo') {
            newTodoRef.append(arrowfn);
        }
        else if (taskData.taskdefValue === 'inprogress') {
            inProgressRef.append(arrowfn);
        }
        else if (taskData.taskdefValue === 'inreview') {
            inReviewRef.append(arrowfn);
        } else {
            completedTaskRef.append(arrowfn);
        }
    }
}

const myArrowFunction = (input_value, prioritiesRef_value, tasdefRef_value, uniqueId) => {
    const divele = document.createElement('div');
    const divtext = document.createElement('div');
    const ptext = document.createElement('p');
    const icons = document.createElement('div');
    const pentext = document.createElement('p');
    const trash = document.createElement('p');
    // const drag = document.createElement('p');
    divele.setAttribute("data-uniqueID", `${uniqueId}`);
    divele.classList.add('taskcontent',`${prioritiesRef_value}`);
    divtext.classList.add('textContentArea',`${tasdefRef_value}`);
    icons.classList.add('iconDiv');
    icons.appendChild(pentext);
    icons.appendChild(trash);
    // icons.appendChild(drag);
    pentext.classList.add('fa','fa-pencil-square-o','icon-pen');
    trash.classList.add('fa','fa-trash-o','icon-trash');
    // drag.classList.add('fa','fa-hand-rock-o','icon-drag');
    divtext.appendChild(ptext);
    divele.appendChild(divtext);
    divele.appendChild(icons);
    // drag.setAttribute("draggable", true);

// Add this line to make the element draggable
divele.setAttribute("draggable", true);
// divele.addEventListener("dragstart", handleDragStart);
    ptext.innerText = input_value;
    return divele;
};




function setDefaultVal(){
    // const data = JSON.parse(localdata)[0];
    inputRef.value = " ";
    document.querySelector(`#critical`).selected="true";
    document.querySelector(`#todo`).selected = "true";
}


//Function to  generate a unique ID
function generateUniqueId() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomString = Math.random().toString(36).substr(2, 5); // Generate a random string
    const uniqueId = timestamp + randomString; // Combine timestamp and random string
    return uniqueId;
}


// onLoad LocalStorage data is displayed
function onload(){
    const taskcontentref = document.querySelectorAll('.taskcontent');
    taskcontentref.forEach((Element) => {
        const data = Element;
        data.remove();
    })
 
    // loop over local storage and update values
    Object.entries(localStorage).forEach(([key, value]) => {
        const data = JSON.parse(value)[0];
        if(data.inputValue != " "){
            const arrowfn = myArrowFunction(data.inputValue, data.priorityValue, data.taskdefValue, key);
            if (data.taskdefValue === 'todo') {
                newTodoRef.append(arrowfn);
            }
            else if (data.taskdefValue === 'inprogress') {
                inProgressRef.append(arrowfn);
            }
            else if (data.taskdefValue === 'inreview') {
                inReviewRef.append(arrowfn);
            } else {
                completedTaskRef.append(arrowfn);
            }
        }
    });
}

onload();