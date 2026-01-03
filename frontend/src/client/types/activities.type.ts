export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
	id: string;
	title: string;
	status: TaskStatus;
	assignedTo?: string; // optional user
	dueDate?: string; // ISO string
}

export interface Column {
	id: TaskStatus;
	title: string;
	tasks: Task[];
}
