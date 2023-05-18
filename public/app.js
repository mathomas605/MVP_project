//=====set up===========
const $listItem = $("#to_do_list");
const $urgentListItem = $("#urgent_list");
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
        const $li = $(`<li>${item.task}</li>`);
        const $toggleBtn = $(
          `<input type="checkbox"${
            item.completed ? "Uncomplete" : "Complete"
          }/>`
        );
        $toggleBtn.on("click", () => {
          toggleItemCompletion(item.id, !item.completed);
        });
        $li.append($toggleBtn);
        $completed.append($li);
      });

      urgentItems.forEach((item) => {
        const $li = $(`<li>${item.task}- ${item.description}</li>`);

        $li.on("click", (event) => {
          if (
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "BUTTON"
          ) {
            editItem(item.id, item.task, item.description);
          }
        });
        const $urgentBtn = $(
          `<button>${item.urgent ? "ugent" : "not urgent"}</button>`
        );
        $urgentBtn.on("click", () => {
          toggleUrgent(item.id, !item.urgent);
        });

        const $toggleBtn = $(
          `<input type="checkbox"${
            item.completed ? "Uncomplete" : "Complete"
          }/>`
        );

        $toggleBtn.on("click", () => {
          toggleItemCompletion(item.id, !item.completed);
        });

        $li.append($toggleBtn);
        $li.append($urgentBtn);
        $urgentListItem.append($li);
      });

      todoItems.forEach((item) => {
        const $li = $(`<li>${item.task}- ${item.description}</li>`);

        $li.on("click", () => {
          if (
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "BUTTON"
          ) {
            editItem(item.id, item.task, item.description);
          }
        });
        const $urgentBtn = $(
          `<button>${item.urgent ? "ugent" : "not ugent"}</button>`
        );
        $urgentBtn.on("click", () => {
          toggleUrgent(item.id, !item.urgent);
        });

        const $toggleBtn = $(
          `<input type="checkbox"${
            item.completed ? "Uncomplete" : "Complete"
          }/>`
        );
        $toggleBtn.on("click", () => {
          toggleItemCompletion(item.id, !item.completed);
        });

        $li.append($toggleBtn);
        $li.append($urgentBtn);
        $listItem.append($li);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch to-do items:", error);
    });
};

//===Function to edit a to-do item===
const editItem = (id, task, description) => {
  const updatedTask = prompt("Edit Task:", task);
  const updatedDescription = prompt("Edit Description:", description);

  if (updatedTask !== null && updatedDescription !== null) {
    fetch(`/tododb/to_do_list/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: updatedTask,
        description: updatedDescription,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated to-do item:", data);
        fetchToDoItems();
      })
      .catch((error) => {
        console.error("Failed to update to-do item:", error);
      });
  }
};

///===Function to toggle the completion status of a to-do item===
const toggleItemCompletion = (id, completed) => {
  fetch(`/tododb/to_do_list/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: completed,
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
//===function to toggle urgent status of a todo item===
const toggleUrgent = (id, urgent) => {
  fetch(`/tododb/to_do_list/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urgent: urgent,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("urgent status:", data);
      fetchToDoItems();
    })
    .catch((error) => {
      console.error("Failed to toggle item urgency:", error);
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
      $task.val("");
      $description.val("");
      $isUrgent.prop("checked", false);
    })
    .catch((error) => {
      console.error("Failed to create new to-do item:", error);
    });
};

//===Function to handle the create button click event===
$("#create").on("click", () => {
  createItem();
});

//===Fetch and display the to-do items when the page loads===
fetchToDoItems();
