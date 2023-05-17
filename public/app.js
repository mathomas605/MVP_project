//=====set up===========
const $listItem = $("#to_do_list");
const $urgentListItem = $(".urgent");
const $completed = $("#completed_to_do");
const $task = $("#task");
const $description = $("#description");
const $isUrgent = $("#urgent");

//===Function to fetch and display the to-do items===
const fetchToDoItems = () => {
  $listItem.empty();
  $urgentListItem.empty();
  $completed.empty();

  //===Fetch all to-do items===
  fetch("/tododb/to_do_list")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //===Sort items into completed, urgent, and to-do===
      const completedItems = data.filter((item) => item.completed);
      const urgentItems = data.filter((item) => item.urgent && !item.completed);
      const todoItems = data.filter((item) => !item.urgent && !item.completed);

      completedItems.forEach((item) => {
        $completed.append(`<li>${item.task}/li>`);
      });

      urgentItems.forEach((item) => {
        $urgentListItem.append(`<li>${item.task}- ${item.description}</li>`);
      });

      todoItems.forEach((item) => {
        const $li = $(`<li>${item.task}- ${item.description}</li>`);

        $li.on("click", () => {
          editItem(item.task, item.description, item.urgent, item.completed);
        });

        const $toggleBtn = $(
          `<button>${item.completed ? "Uncomplete" : "Complete"}</button>`
        );
        $toggleBtn.on("click", () => {
          toggleItemCompletion(item.id, !item.completed);
        });

        $li.append($toggleBtn);
        $listItem.append($li);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch to-do items:", error);
    });
};

//===Function to edit a to-do item===
const editItem = (id, task, description, urgent, completed) => {
  console.log("Editing item:", id, task, description, urgent, completed);
};

///===Function to toggle the completion status of a to-do item===
const toggleItemCompletion = (id, completed) => {
  fetch(`/tododb/to_do_list/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: true,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Updated completion status:", data);
      fetchToDoItems();
    })
    .catch((error) => {
      console.error("Failed to toggle item completion:", error);
      console.log(error.response);
    });
};

//===Function to create a new to-do item===
const createItem = () => {
  const task = $task.val();
  const description = $description.val();
  const urgent = $isUrgent.is(":checked");
  const completed = false;

  fetch("/tododb/to_do_list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task: task,
      description: description,
      urgent: urgent,
      completed: completed,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Created new to-do item:", data);
      fetchToDoItems();
    })
    .catch((error) => {
      console.error("Failed to create new to-do item:", error);
    });
};

//===Function to handle the create button click event===
$("#create").click(() => {
  createItem();
});

//===Fetch and display the to-do items when the page loads===
fetchToDoItems();
