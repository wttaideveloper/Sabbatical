"use client";

import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function DragHandle(props: Record<string, unknown>) {
  return (
    <button
      type="button"
      {...props}
      className="cursor-grab touch-none rounded-lg px-2 py-2 text-admin-muted transition-colors hover:bg-admin-bg hover:text-ink active:cursor-grabbing"
      aria-label="Drag to reorder"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="3" r="1.3" />
        <circle cx="11" cy="3" r="1.3" />
        <circle cx="5" cy="8" r="1.3" />
        <circle cx="11" cy="8" r="1.3" />
        <circle cx="5" cy="13" r="1.3" />
        <circle cx="11" cy="13" r="1.3" />
      </svg>
    </button>
  );
}

function SortableRow({ id, children }: { id: string; children: (dragHandle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children(<DragHandle {...attributes} {...listeners} />)}
    </div>
  );
}

/**
 * Generic drag-and-drop reordering — owns only drag mechanics (dnd-kit, with
 * PointerSensor + KeyboardSensor so both touch/mouse dragging and arrow-key
 * reordering work). The parent owns the array and its item rendering; this just
 * calls onReorder with the new order and hands each row a drag-handle button to
 * place wherever fits its layout.
 */
export default function ReorderableList<T>({
  id,
  items,
  getId,
  onReorder,
  renderItem,
}: {
  /** Stable id passed through to DndContext. dnd-kit auto-generates this from an
   *  internal counter otherwise, which drifts between server and client render
   *  passes whenever more than one DndContext exists on a page (e.g. one per
   *  menu group) — causing a hydration-mismatch warning on `aria-describedby`. */
  id: string;
  items: T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandle: ReactNode) => ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {(dragHandle) => renderItem(item, index, dragHandle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
