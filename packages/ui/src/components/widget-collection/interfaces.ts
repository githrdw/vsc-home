export const enum FsTypes {
  Workspace,
  Folder,
  File,
}

export interface WidgetCollectionProps {
  items: {
    folderUri?: {
      path: string;
    };
    workspace?: {
      configPath: {
        path: string;
      };
    };
  }[];
  size: number;
}
