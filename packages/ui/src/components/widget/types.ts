export interface WidgetProps {
  id?: string;
  appearance: {
    title: string;
    color: string;
  };
  data?: {};
  type?: string;
  onWidgetUpdate?: (data: WidgetProps) => void;
}
