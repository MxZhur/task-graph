<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  Edges,
  EventHandlers,
  GridLayout,
  Instance,
  Layouts,
  Nodes,
  VNetworkGraph,
  defineConfigs
} from "v-network-graph"
import "v-network-graph/lib/style.css"
import { TASK_DIFFICULTIES, TASK_PRIORITIES, useTasksStore } from "../stores/tasksStore";
import Breadcrumbs from "./Breadcrumbs.vue";
import FitContentsIcon from "./icons/FitContentsIcon.vue";

const graph = ref<Instance>();

const props = withDefaults(defineProps<{
  parentTaskId: string | null;
}>(), {
  parentTaskId: null,
});

const emit = defineEmits<{
  (e: 'newTaskRequest', nodeX: number, nodeY: number): void
  (e: 'switchParentTask', parentId: string | null): void
}>();

const tasksStore = useTasksStore();

function getScopedTasks() {
  if (props.parentTaskId === null) {
    return tasksStore.topLevelTasks;
  } else {
    return tasksStore.findTasksByParent(props.parentTaskId);
  }
};


const nodes = computed(() => {
  const scopedTasks = getScopedTasks();

  let result: Nodes = {};

  for (let i = 0; i < scopedTasks.length; i++) {
    const element = scopedTasks[i];

    let color: string;

    if (element.progress == 0) {
      color = 'white';
    } else if (element.progress == 100) {
      color = '#a4ff91';
    } else {
      color = '#fff9ab';
    }

    let radius: number;

    switch (element.difficulty) {
      case TASK_DIFFICULTIES.easy:
        radius = 12;
        break;
      case TASK_DIFFICULTIES.normal:
        radius = 18;
        break;
      case TASK_DIFFICULTIES.hard:
        radius = 28;
        break;

      default:
        radius = 16;
        break;
    }

    let strokeDasharray: number = 0;

    let strokeColor: string;

    switch (element.priority) {
      case TASK_PRIORITIES.none:
        strokeColor = '#b8b8b8';
        break;
      case TASK_PRIORITIES.low:
        strokeColor = '#22aee0';
        break;
      case TASK_PRIORITIES.medium:
        strokeColor = '#4ad911';
        break;
      case TASK_PRIORITIES.high:
        strokeColor = '#f7cd43';
        break;
      case TASK_PRIORITIES.critical:
        strokeColor = '#ed1a02';
        break;

      default:
        strokeColor = '#4466cc';
        break;
    }

    let type: string = 'circle';

    const hasChildTasks = tasksStore.findTasksByParent(element.id).length > 0;

    if (hasChildTasks) {
      type = 'rect';
    }

    result[element.id] = {
      type: type,
      name: element.name,
      color: color,
      radius: radius,
      strokeColor: strokeColor,
      strokeDasharray: strokeDasharray,
    }
  }

  return result;
});


const edges = computed(() => {
  const scopedTasks = getScopedTasks();

  let result: Edges = {};

  for (let i = 0; i < scopedTasks.length; i++) {
    const element = scopedTasks[i];

    for (let j = 0; j < element.dependencyTasks.length; j++) {
      const depTaskId = element.dependencyTasks[j];

      result[`${depTaskId} ${element.id}`] = { source: depTaskId, target: element.id }
    }
  }

  return result;
});


const layouts = computed(() => {
  const scopedTasks = getScopedTasks();

  let result: Layouts = {
    nodes: {},
  };

  for (let i = 0; i < scopedTasks.length; i++) {
    const element = scopedTasks[i];

    result.nodes[element.id] = { x: element.nodeX, y: element.nodeY }
  }

  return result;
});


const configs = reactive(
  defineConfigs({
    view: {
      doubleClickZoomEnabled: false,
      grid: {
        visible: true,
        interval: 10,
        thickIncrements: 5,
        line: {
          color: "#e0e0e0",
          width: 1,
          dasharray: 1,
        },
        thick: {
          color: "#cccccc",
          width: 1,
          dasharray: 0,
        },
      },
      layoutHandler: new GridLayout({ grid: 10 }),
    },
    edge: {
      marker: {
        target: {
          type: "arrow",
        }
      },
      selectable: true,
    },
    node: {
      normal: {
        type: node => node.type,
        color: node => node.color ?? 'white',
        radius: node => node.radius ?? 16,
        height: node => (node.radius ?? 16) * 1.5,
        width: node => (node.radius ?? 16) * 1.5,
        strokeColor: node => node.strokeColor ?? '#4466cc',
        strokeWidth: node => node.strokeWidth ?? 3,
        strokeDasharray: node => node.strokeDasharray ?? 0,
      },
      hover: {
        color: node => node.color ?? '#aeaeee',
        strokeColor: node => node.strokeColor ?? '#4466cc',
        strokeWidth: node => node.strokeWidth ?? 3,
      },
      label: {
        fontFamily: 'sans-serif',
        fontSize: 14,
      },
      selectable: true,
    }
  })
);


const eventHandlers: EventHandlers = {
  "node:dragend": (e) => {
    const nodeId = Object.keys(e)[0];
    const nodePosition = Object.values(e)[0];

    tasksStore.updateNodePosition(nodeId, nodePosition.x, nodePosition.y);
  },
  "view:dblclick": ({ event }) => {
    if (!graph.value) {
      return;
    }

    const svgPoint = graph.value.translateFromDomToSvgCoordinates({
      x: event.offsetX,
      y: event.offsetY,
    });

    emit("newTaskRequest", svgPoint.x, svgPoint.y);

  },
  "node:dblclick": (e) => {
    emit("switchParentTask", e.node);
  },
  "node:select": (e) => {
    tasksStore.updateTaskSelection(e);
  },
  "edge:select": (e) => {
    tasksStore.updateLinkSelection(e);
  },
}

function switchParentTask(newParentId: string | null) {
  emit('switchParentTask', newParentId);
}

function fitContents() {
  graph.value?.fitToContents();
}

</script>

<template>
  <Breadcrumbs :parentTaskId="parentTaskId" @switch-parent-task="switchParentTask" />
  <div class="graph-container relative">
    <VNetworkGraph class="graph" ref="graph" :nodes="nodes" :edges="edges" :layouts="layouts" :configs="configs"
      :event-handlers="eventHandlers" />
    <div class="absolute bottom-1 left-1 bg-opacity-50 p-2 text-white bg-black rounded-md flex flex-row">
      <div class="cursor-pointer" title="Fit Contents" @click="fitContents">
        <FitContentsIcon />
      </div>
    </div>
  </div>
</template>

<style scoped>
.graph-container {
  height: calc(100% - 2.5rem);
  background-color: white;
  box-sizing: border-box;
}
</style>
