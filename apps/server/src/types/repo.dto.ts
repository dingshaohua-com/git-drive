export type RepoOrDirOrFile = {
  type: string;
  name: string;
  size?: number;
  url: string;
};


export type GetInfoRequest = {
  path: string;
};

