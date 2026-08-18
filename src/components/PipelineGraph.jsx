import { useMemo } from "react";
import { ReactFlow, Background, Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  GitBranch,
  ListOrdered,
  Box,
  Server,
  HeartPulse,
  Globe,
  AlertTriangle,
} from "lucide-react";

const PIPELINE_STAGES = [
  { key: "created", label: "Deployment created", icon: GitBranch },
  { key: "queued", label: "Queued (BullMQ)", icon: ListOrdered },
  { key: "build", label: "Docker build", icon: Box },
  { key: "container", label: "Container started", icon: Server },
  { key: "health", label: "Health check", icon: HeartPulse },
  { key: "live", label: "Live via Traefik", icon: Globe },
];

const STAGE_MATCHERS = {
  created: () => true,
  queued: (messages) =>
    messages.some((message) => message.includes("deployment queue")),
  build: (messages) =>
    messages.some(
      (message) =>
        message.includes("Building Docker image") ||
        message.includes("Dockerfile found"),
    ),
  container: (messages) =>
    messages.some(
      (message) =>
        message.includes("Starting Docker container") ||
        message.includes("started successfully"),
    ),
  health: (messages) =>
    messages.some(
      (message) =>
        message.includes("Running HTTP health check") ||
        message.includes("health check passed"),
    ),
  live: (messages, status) => status === "READY",
};

function deriveStages(deployment) {
  const messages = deployment.activities.map((activity) => activity.message);
  const status = deployment.status;
  const isInProgress = ["PENDING", "QUEUED", "BUILDING"].includes(status);

  const reachedFlags = PIPELINE_STAGES.map((stage) =>
    STAGE_MATCHERS[stage.key](messages, status),
  );

  let lastReachedIndex = 0;

  reachedFlags.forEach((reached, index) => {
    if (reached) {
      lastReachedIndex = index;
    }
  });

  const failedActivity = deployment.activities.find(
    (activity) => activity.type === "BUILD_FAILED",
  );

  return PIPELINE_STAGES.map((stage, index) => {
    if (status === "FAILED" && index === lastReachedIndex + 1) {
      return {
        ...stage,
        state: "failed",
        errorMessage: failedActivity?.message || "Deployment failed.",
      };
    }

    if (status === "FAILED" && index > lastReachedIndex + 1) {
      return { ...stage, state: "pending", errorMessage: null };
    }

    if (index < lastReachedIndex) {
      return { ...stage, state: "complete", errorMessage: null };
    }

    if (index === lastReachedIndex) {
      return {
        ...stage,
        state: isInProgress ? "active" : "complete",
        errorMessage: null,
      };
    }

    return { ...stage, state: "pending", errorMessage: null };
  });
}

const NODE_WIDTH = 190;
const NODE_GAP = 90;

function buildFlowElements(stages) {
  const nodes = stages.map((stage, index) => ({
    id: stage.key,
    type: "pipelineNode",
    position: { x: index * (NODE_WIDTH + NODE_GAP), y: 0 },
    data: stage,
  }));

  const edges = stages.slice(1).map((stage, index) => {
    const previousStage = stages[index];
    const isActiveEdge =
      previousStage.state === "complete" && stage.state === "active";
    const isFailedEdge = stage.state === "failed";

    return {
      id: `${previousStage.key}-${stage.key}`,
      source: previousStage.key,
      target: stage.key,
      animated: isActiveEdge,
      style: {
        stroke: isFailedEdge ? "#f87171" : isActiveEdge ? "#8338c9" : "#3f3f46",
        strokeWidth: 2,
      },
    };
  });

  return { nodes, edges };
}

const STATE_STYLES = {
  complete: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
  active: "border-[#8338c9] bg-[#8338c9]/10 text-[#c084fc] animate-pulse",
  pending: "border-gray-700 bg-[#141414] text-gray-500",
  failed: "border-red-500 bg-red-500/10 text-red-300",
};

function PipelineNode({ data }) {
  const Icon = data.icon;

  return (
    <div
      title={data.errorMessage || data.label}
      className={`flex w-44 flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-center ${STATE_STYLES[data.state]}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="!border-none !bg-transparent"
      />

      {data.state === "failed" ? (
        <AlertTriangle size={26} />
      ) : (
        <Icon size={26} />
      )}

      <span className="text-xs font-semibold">{data.label}</span>

      {data.state === "failed" && data.errorMessage && (
        <span className="text-[11px] leading-4 text-red-300">
          {data.errorMessage}
        </span>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!border-none !bg-transparent"
      />
    </div>
  );
}

const nodeTypes = { pipelineNode: PipelineNode };

function PipelineGraph({ deployment }) {
  const { nodes, edges } = useMemo(() => {
    const stages = deriveStages(deployment);
    return buildFlowElements(stages);
  }, [deployment]);

  return (
    <div className="h-72 w-full overflow-hidden rounded-2xl border border-gray-800 bg-[#111]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}>
        <Background color="#222" gap={24} />
      </ReactFlow>
    </div>
  );
}

export default PipelineGraph;
