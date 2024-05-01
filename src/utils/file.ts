import { ask, message, open, save } from "@tauri-apps/api/dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { changeWindowTitle } from "./window";
import { APP_NAME } from "./appInfo";
import { i18n } from "../i18n";
import { useTasksStore } from "../stores/tasksStore";
import { useCurrentFileStore } from "../stores/currentFileStore";
import { useRecentFilesStore } from "../stores/recentFilesStore";

export const FILE_EXTENSION = "tgproj";

export const askFileConfirmation = async () => {
  const currentFileStore = useCurrentFileStore();

  if (!currentFileStore.isDirty) {
    return "no";
  }

  const { t } = i18n.global;

  const confirmed = await ask(t("exitConfirmation.youSure"), {
    title: t("exitConfirmation.titleYouSure"),
    type: "warning",
  });
  if (!confirmed) {
    return "cancel";
  }

  const fileSaveConfirmed = await ask(t("exitConfirmation.saveChanges"), {
    title: t("exitConfirmation.titleSaveChanges"),
    type: "warning",
  });

  return fileSaveConfirmed ? "yes" : "no";
};

export const saveFileTo = async (filePath: string) => {
  const tasksStore = useTasksStore();
  const fileContent = JSON.stringify(tasksStore.tasks);

  await writeTextFile(filePath, fileContent);

  const currentFileStore = useCurrentFileStore();
  currentFileStore.setToSavedFile(filePath);

  const recentFilesStore = useRecentFilesStore();
  recentFilesStore.pushNewRecentFile(filePath);

  changeWindowTitle(APP_NAME + " - " + getFileBaseName(filePath));
};

export const saveFileAs = async () => {
  const filePath = await save({
    filters: [
      {
        name: "Task Graph Project",
        extensions: [FILE_EXTENSION],
      },
    ],
  });

  if (filePath === null) {
    return null;
  }

  await saveFileTo(filePath);

  return filePath;
};

export const openFile = async () => {
  let filePath = await open({
    multiple: false,
    filters: [
      {
        name: "Task Graph Project",
        extensions: [FILE_EXTENSION],
      },
    ],
  });

  if (filePath === null) {
    return null;
  }

  if (Array.isArray(filePath)) {
    filePath = filePath[0];
  }

  if (!(await readFile(filePath))) {
    return null;
  }

  return filePath;
};

export const readFile = async (filePath: string) => {
  const { t } = i18n.global;

  try {
    const fileContent = await readTextFile(filePath);

    const tasksStore = useTasksStore();
    tasksStore.loadTasks(fileContent);

    const currentFileStore = useCurrentFileStore();
    currentFileStore.setToOpenedFile(filePath);

    const recentFilesStore = useRecentFilesStore();
    recentFilesStore.pushNewRecentFile(filePath);

    changeWindowTitle(APP_NAME + " - " + getFileBaseName(filePath));

    return true;
  } catch {
    message(t("unableToOpenFile") + ' "' + filePath + '"', {
      title: t("error"),
      type: "error",
    });

    return false;
  }
};

export const commandFileNew = async () => {
  const askFileConfirmationResult = await askFileConfirmation();

  if (askFileConfirmationResult === "cancel") {
    return;
  }

  if (askFileConfirmationResult === "yes") {
    if (!(await commandFileSave())) {
      return;
    }
  }

  const tasksStore = useTasksStore();
  tasksStore.clearTasks();

  const currentFileStore = useCurrentFileStore();
  currentFileStore.setToNewFile();

  const { t } = i18n.global;

  changeWindowTitle(APP_NAME + " - " + t('newProject'));
};

export const commandFileOpen = async () => {
  const askFileConfirmationResult = await askFileConfirmation();

  if (askFileConfirmationResult === "cancel") {
    return;
  }

  if (askFileConfirmationResult === "yes") {
    if (!(await commandFileSave())) {
      return;
    }
  }

  await openFile();
};

export const commandFileSave = async () => {
  const currentFileStore = useCurrentFileStore();

  if (currentFileStore.filePath !== null) {
    saveFileTo(currentFileStore.filePath);
    return true;
  } else {
    return (await saveFileAs()) !== null;
  }
};

export const commandFileSaveAs = async () => {
  await saveFileAs();
};

export const commandFileOpenRecent = async (filePath: string) => {
  const askFileConfirmationResult = await askFileConfirmation();

  if (askFileConfirmationResult === "cancel") {
    return;
  }

  if (askFileConfirmationResult === "yes") {
    if (!(await commandFileSave())) {
      return;
    }
  }

  readFile(filePath);
}

export const getFileBaseName = (filePath: string | null) => {
  if (filePath === null) {
    return "";
  }

  let fileBaseNameFromBackSlash = filePath.toString().split("\\").pop();
  let fileBaseNameFromForwardSlash = filePath.toString().split("/").pop();

  if (
    fileBaseNameFromBackSlash !== undefined &&
    fileBaseNameFromForwardSlash !== undefined
  ) {
    if (
      fileBaseNameFromBackSlash.length < fileBaseNameFromForwardSlash.length
    ) {
      return fileBaseNameFromBackSlash;
    } else {
      return fileBaseNameFromForwardSlash;
    }
  }

  return "";
};
