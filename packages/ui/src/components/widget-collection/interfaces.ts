export const enum FsTypes {
  Workspace = 'workspace',
  Folder = 'folder',
  File = 'file',
}
export interface RecentItem {
  folderUri?: {
    path: string;
  };
  workspace?: {
    configPath: {
      path: string;
    };
  };
}

export interface CollectionItem {
  type: FsTypes;
  path: string;
  name: string;
}

export interface WidgetCollectionProps {
  items: CollectionItem[];
  size: number;
  setCallbacks?: (callbacks: any) => void;
}

export type FileList = Array<{ path: string }>;
