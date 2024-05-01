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

export const calcAvgProgress = (
  tasks: Task[],
  digitsAfterPoint: number = 1
) => {
  if (tasks.length === 0) {
    return 0;
  }

  const progressWeightedSum = tasks
    .map((t) => (t.progress ?? 0) * (t.difficulty ?? 1))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const difficultySum = tasks
    .map((t) => t.difficulty ?? 1)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const avgProgressRaw = progressWeightedSum / difficultySum;

  if (avgProgressRaw - Math.floor(avgProgressRaw) !== 0) {
    return (
      Math.round(avgProgressRaw * (digitsAfterPoint * 10)) /
      (digitsAfterPoint * 10)
    );
  } else {
    return avgProgressRaw;
  }
};

export const useTasksStore = defineStore("tasks", () => {
  const tasks = reactive<Task[]>(initialState);

  const selectedTasksIds = ref<string[]>([]);

  const selectedTasks = computed(() => {
    return selectedTasksIds.value
      .map((tId) => tasks.find((t) => t.id === tId))
      .filter((t) => t !== undefined);
  });

  const selectedLinksIds = ref<string[]>([]);

  const selectedLinks = computed(() => {
    return selectedLinksIds.value
      .map((lId) => {
        const nodesIds = lId.split(' ', 2);

        const sourceTaskId = nodesIds[0];
        const targetTaskId = nodesIds[nodesIds.length - 1];

        const sourceTask = tasks.find(t => t.id === sourceTaskId);
        const targetTask = tasks.find(t => t.id === targetTaskId);

        if (sourceTask === undefined || targetTask === undefined) {
          return null;
        }

        return {
          source: sourceTask,
          target: targetTask,
        }
      })
      .filter((t) => t !== null);
  });

  const topLevelTasks = computed(() => {
    return tasks.filter((t) => t.parentTaskId === null);
  });

  const overallProjectProgress = computed(() => {
    const topLevelTasks = tasks.filter((t) => t.parentTaskId === null);

    return calcAvgProgress(topLevelTasks);
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

    recalculateProgress();
  }

  function deleteTask(id: string) {
    let task = tasks.find((el) => el.id === id);

    if (task === undefined) {
      return;
    }

    // Remove all dependencies

    for (let i = 0; i < tasks.length; i++) {
      const dependentTask = tasks[i];

      dependentTask.dependencyTasks = dependentTask.dependencyTasks.filter(
        (tId) => tId !== id
      );
    }

    // Find all the tasks to delete recursively, and write down their IDs

    let processedTasksIDs: string[] = [];
    let tasksToDelete: string[] = [task.id];

    let queue = [task.id];

    while (queue.length > 0) {
      let processedTaskID = queue.shift();

      let processedTask = tasks.find((el) => el.id === processedTaskID);

      if (processedTask === undefined) {
        continue;
      }

      const childTasks = tasks
        .filter((t) => t.parentTaskId === processedTaskID)
        .map((t) => t.id);

      for (let childID of childTasks) {
        if (!processedTasksIDs.includes(childID)) {
          queue.push(childID);
          processedTasksIDs.push(childID);
          tasksToDelete.push(childID);
        }
      }
    }

    // Delete the task and its entire subtree

    for (let i = 0; i < tasksToDelete.length; i++) {
      const tId = tasksToDelete[i];

      const deletedTaskIndex = tasks.findIndex((t) => t.id === tId);

      if (deletedTaskIndex !== -1) {
        tasks.splice(deletedTaskIndex, 1);
      }
    }

    recalculateProgress();
  }

  function addDependency(depId: string, id: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    if (!task.dependencyTasks.includes(depId)) {
      task.dependencyTasks.push(depId);
    }
  }

  function removeDependency(depId: string, id: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.dependencyTasks = task.dependencyTasks.filter((tId) => tId !== depId);
  }

  function updateTaskSelection(ids: string[]) {
    selectedTasksIds.value = ids;
  }
  
  function updateLinkSelection(ids: string[]) {
    selectedLinksIds.value = ids;
  }

  function updateName(id: string, newName: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }
    task.name = newName;
  }

  function updateDescription(id: string, newDescription: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.description = newDescription;
  }

  function updateProgress(id: string, newProgress: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    const hasChildTasks = findTasksByParent(id).length > 0;

    if (!hasChildTasks) {
      task.progress = newProgress;
    }

    recalculateProgress();
  }

  function markTasksAsDone(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      let task = tasks.find((t) => t.id === id);

      if (task === undefined) {
        continue;
      }

      const hasChildTasks = findTasksByParent(id).length > 0;

      if (!hasChildTasks) {
        task.progress = 100;
      }
    }

    recalculateProgress();
  }

  function updatePriority(id: string, newPriority: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.priority = newPriority;
  }

  function updateDufficulty(id: string, newDufficulty: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.difficulty = newDufficulty;
  }

  function updateNodePosition(id: string, x: number, y: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.nodeX = x;
    task.nodeY = y;
  }

  function recalculateProgress() {
    let leafTasksIDs: string[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      const taskHasChildren =
        tasks.filter((t) => t.parentTaskId === task.id).length > 0;

      if (!taskHasChildren) {
        leafTasksIDs.push(task.id);
      }
    }

    let processedTasksIDs: string[] = [];

    let queue: string[] = [...leafTasksIDs];

    while (queue.length > 0) {
      let nextQueue: string[] = [];

      for (const queuedID of queue) {
        let queuedTask = tasks.find((t) => t.id === queuedID);

        if (queuedTask === undefined) {
          continue;
        }

        const childTasks = tasks.filter((t) => t.parentTaskId === queuedID);

        if (childTasks.length > 0) {
          queuedTask.progress = calcAvgProgress(childTasks);
        }

        processedTasksIDs.push(queuedID);

        if (
          queuedTask.parentTaskId !== null &&
          !nextQueue.includes(queuedTask.parentTaskId)
        ) {
          nextQueue.push(queuedTask.parentTaskId);
        }
      }

      queue = nextQueue;
    }
  }

  return {
    tasks,
    topLevelTasks,
    overallProjectProgress,
    findTasksByParent,
    findTaskById,
    createTask,
    updateName,
    updateDescription,
    updateProgress,
    markTasksAsDone,
    updatePriority,
    updateDufficulty,
    deleteTask,
    updateNodePosition,
    updateTaskSelection,
    updateLinkSelection,
    recalculateProgress,
    addDependency,
    removeDependency,
    selectedTasksIds,
    selectedTasks,
    selectedLinksIds,
    selectedLinks,
  };
});