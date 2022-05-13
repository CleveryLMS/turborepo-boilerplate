export interface ApiItem {
  id?: number;
  createdAt?: any;
  updatedAt?: any;

  meta?: any;
}

export interface ApiFile {
  url: string;
  name: string;
  extname: 'jpg' | 'png' | string;
  size: number;
  mimeType: 'image/jpeg' | 'image/png' | string;
}
