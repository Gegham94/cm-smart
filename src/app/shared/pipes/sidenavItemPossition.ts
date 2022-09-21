import { Pipe, PipeTransform } from '@angular/core';

import { SidenavElem } from '../../core/models';

@Pipe({
  name: 'sidenavItemPossition',
  pure: false,
})
export class SidenavItemPossitionPipe implements PipeTransform {
  transform(sidenavData: SidenavElem[], filter: string): any {
    if (!sidenavData || !filter) {
      return sidenavData;
    }

    return sidenavData.filter((el) => el.possition === filter);
  }
}
