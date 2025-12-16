import { ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input({ required: true }) text!: string; 
  
  @Input() disabled: boolean = false;

  @Input() type: 'button' | 'submit' = 'button';
}