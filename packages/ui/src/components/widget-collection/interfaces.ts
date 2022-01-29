export const enum FsTypes {
  Workspace = 'workspace',
  Folder = 'folder',
  File = 'file',
  Uri = 'uri',
}
export interface RecentItem {
  folderUri?: {
    path: string;
    external?: string;
    authority?: string;
  };
  workspace?: {
    configPath: {
      path: string;
    };
  };
  label?: string;
}

export interface CollectionItem {
  type: FsTypes;
  path: string;
  name: string;
  label?: string | boolean;
}

export interface WidgetCollectionProps {
  id: string;
  items: CollectionItem[];
  size: number;
  setCallbacks?: (callbacks: any) => void;
}

export type FileList = Array<{ path: string }>;
