import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: number;
  progress: number;
  difficulty: number;
  parentTaskId: string | null;
  dependencyTasks: string[];
  nodeX: number;
  nodeY: number;
};

export type NewTaskFormFields = {
  name: string;
  description: string;
  priority: number;
  difficulty: number;
  parentTaskId: string | null;
  nodeX: number;
  nodeY: number;
};

export const TASK_PRIORITIES = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4,
  none: 5,
};

export const TASK_DIFFICULTIES = {
  hard: 2,
  normal: 1,
  easy: 0.5,
};

const initialState: Task[] = [
  {
    id: "qaz",
    name: "Qazaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    description:
      "Qazaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    priority: 3,
    progress: 50,
    difficulty: 0.5,
    parentTaskId: null,
    dependencyTasks: ["wsx"],
    nodeX: 125,
    nodeY: 125,
  },
  {
    id: "wsx",
    name: "Wsx",
    description: "",
    priority: 4,
    progress: 50,
    difficulty: 0.5,
    parentTaskId: null,
    dependencyTasks: [],
    nodeX: 0,
    nodeY: 0,
  },
  {
    id: "rfv",
    name: "Rfv",
    description: "",
    priority: 5,
    progress: 10,
    difficulty: 1,
    parentTaskId: null,
    dependencyTasks: ["wsx", "qaz"],
    nodeX: 250,
    nodeY: 0,
  },
  {
    id: "asd",
    name: "Asd",
    description: "",
    priority: 4,
    progress: 50,
    difficulty: 0.5,
    parentTaskId: "wsx",
    dependencyTasks: [],
    nodeX: 0,
    nodeY: 0,
  },
];

export const useTasksStore = defineStore("tasks", () => {
  const tasks = reactive<Task[]>(initialState);

  const selectedTasksIds = ref<string[]>([]);

  const selectedTasks = computed(() => {
    return selectedTasksIds.value.map((tId) => tasks.find(t => t.id === tId));
  });

  const topLevelTasks = computed(() => {
    return tasks.filter((t) => t.parentTaskId === null);
  });

  function findTasksByParent(parentId: string) {
    return tasks.filter((t) => t.parentTaskId === parentId);
  }

  function findTaskById(id: string) {
    return tasks.find((t) => t.id === id);
  }

  function createTask(formFields: NewTaskFormFields) {
    const newTask: Task = {
      id: nanoid(),
      name: formFields.name,
      description: formFields.description,
      priority: formFields.priority,
      progress: 0,
      difficulty: formFields.difficulty,
      parentTaskId: formFields.parentTaskId,
      dependencyTasks: [],
      nodeX: formFields.nodeX,
      nodeY: formFields.nodeY,
    };

    tasks.push(newTask);
  }

  function updateSelection(ids: string[]) {
    selectedTasksIds.value = ids;
  }

  function updateNodePosition(id: string, x: number, y: number) {
    let task = tasks.find((t) => t.id === id);

    if (task !== undefined) {
      task.nodeX = x;
      task.nodeY = y;
    }
  }

  return {
    tasks,
    topLevelTasks,
    findTasksByParent,
    findTaskById,
    createTask,
    updateNodePosition,
    updateSelection,
    selectedTasksIds,
    selectedTasks,
  };
});
