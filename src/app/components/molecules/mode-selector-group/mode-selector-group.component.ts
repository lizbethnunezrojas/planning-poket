import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioSelectorComponent } from '../../atoms/radio-selector/radio-selector.component';

@Component({
  selector: 'app-mode-selector-group',
  standalone: true,
  imports: [ ReactiveFormsModule, RadioSelectorComponent],
  templateUrl: './mode-selector-group.component.html',
  styleUrls: ['./mode-selector-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectorGroupComponent {
  @Input({ required: true }) control!: FormControl;
}
