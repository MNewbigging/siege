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
import { Dice } from "../app-state/types";

interface DiceDrag {
  dice: Dice;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  isDragging: boolean;
}

type DropHandler = (dice: Dice, pos: { x: number; y: number }) => void;

interface DiceDragContextValue {
  activeDrag: DiceDrag | null;
  startDrag: (dice: Dice, event: React.PointerEvent<HTMLDivElement>) => void;
  registerDropTarget: (element: HTMLElement, onDrop: DropHandler) => () => void;
}

const DiceDragContext = createContext<DiceDragContextValue | null>(null);

export function DiceDragProvider({ children }: PropsWithChildren) {
  const [activeDrag, setActiveDrag] = useState<DiceDrag | null>(null);
  const activeDragRef = useRef<DiceDrag | null>(null);
  const dropTargets = useRef(new Map<HTMLElement, DropHandler>());

  const updateDrag = (drag: DiceDrag | null) => {
    activeDragRef.current = drag;
    setActiveDrag(drag);
  };

  const startDrag = useCallback(
    (dice: Dice, event: React.PointerEvent<HTMLDivElement>) => {
      if (!event.isPrimary || event.button !== 0 || activeDragRef.current)
        return;

      event.preventDefault();
      updateDrag({
        dice,
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
        let target: [HTMLElement, DropHandler] | undefined;
        let targetArea = Infinity;

        for (const [element, onDrop] of dropTargets.current) {
          const rect = element.getBoundingClientRect();
          const isInside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          const area = rect.width * rect.height;

          if (element.isConnected && isInside && area < targetArea) {
            target = [element, onDrop];
            targetArea = area;
          }
        }

        if (target) {
          const [element, onDrop] = target;
          const rect = element.getBoundingClientRect();
          onDrop(drag.dice, {
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
          });
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
    () => ({ activeDrag, startDrag, registerDropTarget }),
    [activeDrag, startDrag, registerDropTarget],
  );

  return (
    <DiceDragContext.Provider value={contextValue}>
      {children}
      {activeDrag?.isDragging && (
        <div
          className={`dice-display ${activeDrag.dice.type} dice-drag-preview`}
          style={{ left: activeDrag.x, top: activeDrag.y }}
        >
          {activeDrag.dice.value}
        </div>
      )}
    </DiceDragContext.Provider>
  );
}

export function useDiceDrag() {
  const context = useContext(DiceDragContext);
  if (!context)
    throw new Error("useDiceDrag must be used within DiceDragProvider");
  return context;
}
