import {Component, Input} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-result',
  standalone: true,
    imports: [
        MatProgressBar
    ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  @Input() yesResult: number | undefined;
  @Input() noResult: number | undefined;
}
