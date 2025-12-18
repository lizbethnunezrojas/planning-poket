import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radio-selector.component.html',
  styleUrls: ['./radio-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioSelectorComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) value!: string;
  @Input({ required: true }) label!: string;
}
