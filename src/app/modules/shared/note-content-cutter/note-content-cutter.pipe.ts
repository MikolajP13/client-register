import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noteContentCutter'
})
export class NoteContentCutterPipe implements PipeTransform {

  transform(value: string): string {
    return value.length < 70 ? value : value.substring(0, 70) + '...';
  }

}
