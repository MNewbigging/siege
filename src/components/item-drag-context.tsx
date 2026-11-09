import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BattlefieldCard, Dice } from "../app-state/types";
import "./item-drag-context.scss";

export type DragItem =
  { type: "dice"; dice: Dice } | { type: "card"; card: BattlefieldCard };

interface ItemDrag {
  item: DragItem;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  isDragging: boolean;
}

type DropHandler = (item: DragItem, pos: { x: number; y: number }) => void;

interface ItemDragContextValue {
  activeDrag: ItemDrag | null;
  isActiveDragItem: (item: DragItem) => boolean;
  startDrag: (
    item: DragItem,
    event: React.PointerEvent<HTMLDivElement>,
  ) => void;
  registerDropTarget: (element: HTMLElement, onDrop: DropHandler) => () => void;
}

const ItemDragContext = createContext<ItemDragContextValue | null>(null);

export function ItemDragProvider({ children }: PropsWithChildren) {
  const [activeDrag, setActiveDrag] = useState<ItemDrag | null>(null);
  const activeDragRef = useRef<ItemDrag | null>(null);
  const dropTargets = useRef(new Map<HTMLElement, DropHandler>());

  const updateDrag = (drag: ItemDrag | null) => {
    activeDragRef.current = drag;
    setActiveDrag(drag);
  };

  const startDrag = useCallback(
    (item: DragItem, event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary || event.button !== 0 || activeDragRef.current)
        return;

      event.preventDefault();
      updateDrag({
        item,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        x: event.clientX,
        y: event.clientY,
        isDragging: false,
      });
    },
    [],
  );

  const registerDropTarget = useCallback(
    (element: HTMLElement, onDrop: DropHandler) => {
      dropTargets.current.set(element, onDrop);
      return () => dropTargets.current.delete(element);
    },
    [],
  );

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const drag = activeDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const moved =
        drag.isDragging ||
        Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >=
          5;

      updateDrag({
        ...drag,
        x: event.clientX,
        y: event.clientY,
        isDragging: moved,
      });
    }

    function handlePointerUp(event: PointerEvent) {
      const drag = activeDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (drag.isDragging) {
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        if (hit) {
          const target = [...dropTargets.current].find(
            ([element]) => element === hit || element.contains(hit),
          );

          if (target) {
            const [element, onDrop] = target;
            const rect = element.getBoundingClientRect();
            onDrop(drag.item, {
              x: (event.clientX - rect.left) / rect.width,
              y: (event.clientY - rect.top) / rect.height,
            });
          }
        }
      }

      updateDrag(null);
    }

    function handlePointerCancel(event: PointerEvent) {
      if (activeDragRef.current?.pointerId === event.pointerId)
        updateDrag(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      activeDrag,
      isActiveDragItem: (item: DragItem) => {
        if (!activeDrag?.isDragging || activeDrag.item.type !== item.type)
          return false;

        // We have to compare the given item type AND the active drag item type...
        switch (activeDrag.item.type) {
          case "dice":
            return (
              item.type === "dice" && activeDrag.item.dice.id === item.dice.id
            );
          case "card":
            return item.type === "card" && activeDrag.item.card === item.card;
          default:
            return false;
        }
      },
      startDrag,
      registerDropTarget,
    }),
    [activeDrag, startDrag, registerDropTarget],
  );

  return (
    <ItemDragContext.Provider value={contextValue}>
      {children}
      {activeDrag?.isDragging && (
        <DragPreview item={activeDrag.item} x={activeDrag.x} y={activeDrag.y} />
      )}
    </ItemDragContext.Provider>
  );
}

interface DragPreviewProps {
  x: number;
  y: number;
}

function DiceDragPreview({ dice, x, y }: DragPreviewProps & { dice: Dice }) {
  return (
    <div
      className={`dice-display ${dice.type} dice-drag-preview`}
      style={{ left: x, top: y }}
    >
      {dice.value}
    </div>
  );
}

function CardDragPreview({
  card,
  x,
  y,
}: DragPreviewProps & { card: BattlefieldCard }) {
  return (
    <div className="card-drag-preview" style={{ left: x, top: y }}>
      {card.name}
    </div>
  );
}

function DragPreview({ item, x, y }: { item: DragItem; x: number; y: number }) {
  switch (item.type) {
    case "dice":
      return <DiceDragPreview dice={item.dice} x={x} y={y} />;
    case "card":
      return <CardDragPreview card={item.card} x={x} y={y} />;
    default:
      return null;
  }
}

export function useItemDrag() {
  const context = useContext(ItemDragContext);
  if (!context)
    throw new Error("useItemDrag must be used within ItemDragProvider");
  return context;
}
