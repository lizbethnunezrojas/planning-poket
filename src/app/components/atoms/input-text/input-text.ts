import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './input-text.html',
  styleUrls: ['./input-text.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() placeholder = '';
  @Input({ required: true }) id!: string;
}
