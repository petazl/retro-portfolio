export type WindowType = "about" | "social" | "music";

export type WindowState = {
  id: WindowType;
  type: WindowType;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

export type DragState = {
  id: WindowType;
  offsetX: number;
  offsetY: number;
};
