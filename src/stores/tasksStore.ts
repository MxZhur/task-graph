import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import { useCurrentFileStore } from "./currentFileStore";

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
  const tasks = reactive<Task[]>([]);

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
        const nodesIds = lId.split(" ", 2);

        const sourceTaskId = nodesIds[0];
        const targetTaskId = nodesIds[nodesIds.length - 1];

        const sourceTask = tasks.find((t) => t.id === sourceTaskId);
        const targetTask = tasks.find((t) => t.id === targetTaskId);

        if (sourceTask === undefined || targetTask === undefined) {
          return null;
        }

        return {
          source: sourceTask,
          target: targetTask,
        };
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

  const selectedParentTaskId = ref<string | null>(null);

  function switchParentTask(newParentTaskId: string | null) {
    selectedParentTaskId.value = newParentTaskId;
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

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
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

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function addDependency(depId: string, id: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    if (!task.dependencyTasks.includes(depId)) {
      task.dependencyTasks.push(depId);
    }

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function removeDependency(depId: string, id: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.dependencyTasks = task.dependencyTasks.filter((tId) => tId !== depId);

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
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

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function updateDescription(id: string, newDescription: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.description = newDescription;

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
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

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
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

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function updatePriority(id: string, newPriority: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.priority = newPriority;

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function updateDufficulty(id: string, newDufficulty: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.difficulty = newDufficulty;

    recalculateProgress();

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
  }

  function updateNodePosition(id: string, x: number, y: number) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return;
    }

    task.nodeX = x;
    task.nodeY = y;

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToDirtyFile();
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

  function getDependencyProgress(id: string) {
    let task = tasks.find((t) => t.id === id);

    if (task === undefined) {
      return 100;
    }

    const depTasks = tasks.filter((t) => task.dependencyTasks.includes(t.id));

    if (depTasks.length === 0) {
      return 100;
    }

    return calcAvgProgress(depTasks);
  }

  function loadTasks(source: string) {
    const sourceParsed = JSON.parse(source);

    if (!Array.isArray(sourceParsed)) {
      return;
    }

    clearTasks();

    for (let i = 0; i < sourceParsed.length; i++) {
      tasks.push(sourceParsed[i]);
    }

    switchParentTask(null);
    updateTaskSelection([]);
    updateLinkSelection([]);
  }

  function clearTasks() {
    tasks.splice(0, tasks.length);
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
    getDependencyProgress,
    selectedTasksIds,
    selectedTasks,
    selectedLinksIds,
    selectedLinks,
    selectedParentTaskId,
    switchParentTask,
    loadTasks,
    clearTasks,
  };
});
