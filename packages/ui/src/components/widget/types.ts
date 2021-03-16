export interface WidgetProps {
  id?: string;
  appearance: {
    title: string;
    color: string;
  };
  data?: {};
  type?: string;
  layout?: {
    [id: string]: object;
  };
  x?: number;
  y?: number;
  onWidgetUpdate?: (data: WidgetProps) => void;
  onWidgetDelete?: () => void;
}
