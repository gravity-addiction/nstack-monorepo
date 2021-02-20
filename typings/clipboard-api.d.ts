export interface Clipboard {
  writeText(newClipText: string): Promise<void>;
}
