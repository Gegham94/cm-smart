export interface SidenavElem {
  name: string;
  route: string[];
  possition?: string;
  iconPath: string;
  index: number;
  isOpen?: boolean;
  children?: SidenavElem[];
}
