// Server Functions

const fetch_todos = async () => {
	const res = await fetch("/todos");
	const data = await res.json();
	let number_of_tasks = data.length;
	let number_of_completed_tasks = data.filter((todo) => todo.completed).length;

	const todo_count = document.querySelector(".total");
	todo_count.innerHTML = number_of_tasks;
	const completed_count = document.querySelector(".completed");
	completed_count.innerHTML = `${number_of_completed_tasks} of ${number_of_tasks}`;

	const todo_list = document.querySelector(".todo-list");
	todo_list.innerHTML = "";
	data.forEach((todo) => {
		const todo_item = document.createElement("div");
		let id = todo._id.toString();
		todo_item.classList.add("task");
		todo_item.setAttribute("data-id", todo._id);
		todo_item.innerHTML = `
			<input type="checkbox" data-id=${todo._id}>
			<p class="main-stuff">${todo.task}</p>
			<button class='delete-btn' onclick=delete_task('${id}')><img src="images/delete.svg" alt="delete"></button>
		`;

		if (todo.completed) {
			todo_item.classList.add("completed-task");
			todo_item.querySelector("input").checked = true;
		}

		todo_list.appendChild(todo_item);
	});
};

fetch_todos();

const add_todo = async (task) => {
	await fetch("/todos", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ task, completed: false }),
	});

	fetch_todos();
};

const delete_todo = async (id) => {
	await fetch(`/todos`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});

	fetch_todos();
};

const update_todo = async (id, completed) => {
	await fetch(`/todos/completed/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, completed }),
	});

	fetch_todos();
};

const update_task = async (id, task) => {
	await fetch("/todos/", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, task }),
	});

	fetch_todos();
};

const add_task_input = document.querySelector("#add_task");
const submit_btn = document.querySelector(".submit-btn");

submit_btn.addEventListener("click", function (e) {
	e.preventDefault();
	if (add_task_input.value === "") {
		alert("Add A Task!!");
	} else {
		add_todo(add_task_input.value);
		add_task_input.value = "";
	}
});

const todo_list = document.querySelector(".todo-list");
function delete_task(id) {
	delete_todo(id);
}

todo_list.addEventListener("click", function (e) {
	if (e.target.tagName === "INPUT") {
		let id = e.target.dataset.id;
		let completed = e.target.checked;
		update_todo(id, completed);
	}
});

const modal_container = document.getElementById("modalContainer");

function close_modal() {
	modal_container.style.display = "none";
}

const close_btn = document.getElementById("closeModalBtn");
close_btn.addEventListener("click", close_modal);

todo_list.addEventListener("click", function (e) {
	if (e.target.className === "task") {
		modal_container.style.display = "flex";
		document.querySelector("#edit_task").value =
			e.target.querySelector(".main-stuff").innerHTML;
		document.querySelector(".submit-btn-m").setAttribute("data-id", e.target.dataset.id);

		document.querySelector(".submit-btn-m").addEventListener("click", function (x) {
			x.preventDefault();
			let task = document.querySelector("#edit_task").value;
			let id = document.querySelector(".submit-btn-m").getAttribute("data-id");
			update_task(id, task);
			close_modal();
		});
	}
});
