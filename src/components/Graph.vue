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
import { useTasksStore } from "../stores/tasksStore";
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

    result[element.id] = {
      name: element.name,
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

      result[depTaskId + element.id] = { source: depTaskId, target: element.id }
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
      }
    },
    node: {
      normal: {
        color: 'white',
        strokeColor: '#4466cc',
        strokeWidth: 1,
      },
      hover: {
        color: '#aeaeee',
        strokeColor: '#4466cc',
        strokeWidth: 1,
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
    tasksStore.updateSelection(e);
  }
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
