import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-decisive',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './decisive.component.html',
  styleUrl: './decisive.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecisiveComponent {
  readonly dialogRef = inject(MatDialogRef<DecisiveComponent>);
}
