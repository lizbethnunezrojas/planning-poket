import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeWords',
  standalone: true,
})
export class CapitalizeWordsPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    const name = value.trim();

    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
