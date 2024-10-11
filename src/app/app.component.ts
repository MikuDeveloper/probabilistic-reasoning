import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { HistoricTableComponent } from './components/historic-table/historic-table.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FilesService } from './services/files.service';
import { HistoricTableItem } from './interfaces/historic-table-item';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, HistoricTableComponent, MatButton, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'probabilistic-reasoning';
  filesService = inject(FilesService);
  historicData: HistoricTableItem[] = [];

  async uploadFile(event: Event, inputFile: HTMLInputElement) {
    const files = (<HTMLInputElement> event.target).files;
    if (!files || files.length === 0) return;

    if (files.length > 0) {
      this.historicData = await this.filesService.loadXLSX(files[0]);
      console.log(this.historicData)
    }

    inputFile.value = '';
  }
}
