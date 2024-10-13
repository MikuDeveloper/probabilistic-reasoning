import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { HistoricTableComponent } from './components/historic-table/historic-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from './services/files.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PredictionFormComponent } from './components/prediction-form/prediction-form.component';
import { ResultComponent } from './components/result/result.component';
import { collection, doc, Firestore, getDocs, writeBatch } from '@angular/fire/firestore';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DecisiveComponent } from './components/decisive/decisive.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    HistoricTableComponent,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    PredictionFormComponent,
    ResultComponent,
    NgClass,
    MatTooltip
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _firestore: Firestore = inject(Firestore);
  private _filesService = inject(FilesService);
  private _dialog: MatDialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  title = 'Razonamiento';
  subtitle = 'probabilístico';
  @ViewChild('tableComponent') tableComponent!: HistoricTableComponent;
  @ViewChild('inputFile') inputFile!: HTMLInputElement;

  async uploadFile(event: Event, inputFile: HTMLInputElement) {
    const files = (<HTMLInputElement> event.target).files;
    if (!files || files.length === 0) return;

    if (files.length > 0) {
      const historicData = await this._filesService.loadXLSX(files[0]);

      const batch = writeBatch(this._firestore);
      historicData.forEach(historic => {
        const docRef = doc(collection(this._firestore, 'historical'));
        historic.yesOdds = historic.yesOdds || '';
        historic.noOdds = historic.noOdds || '';
        batch.set(doc(this._firestore, 'historical', docRef.id), historic, { merge: true });
      });
      await batch.commit();
    }
    inputFile.value = '';
    this._snackBar.open('¡Datos históricos importados éxitosamente!', 'Aceptar');
  }

  async removeData() {
    const ref = this._dialog.open(DecisiveComponent);
    ref.afterClosed().subscribe(async (res: boolean) => {
      if (res) {
        const batch = writeBatch(this._firestore);
        const ids: string [] = (await getDocs(collection(this._firestore, 'historical')))
          .docs.map((doc) => doc.id);
        ids.forEach((id) => {
          batch.delete(doc(this._firestore, 'historical', id));
        });
        await batch.commit();
        this._snackBar.open('¡Datos históricos eliminados!', 'Cerrar');
      }
    });
  }
}
