import { Component, inject, Input, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HistoricTableItem } from '../../interfaces/historic-table-item';
import { HistoricTableComponent } from '../historic-table/historic-table.component';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
    MatTooltip
  ],
  templateUrl: './prediction-form.component.html',
  styleUrl: './prediction-form.component.scss'
})
export class PredictionFormComponent {
  private _firestore: Firestore = inject(Firestore);
  private _snackBar = inject(MatSnackBar);
  private _dialog: MatDialog = inject(MatDialog);
  @Input() historicalData: HistoricTableItem[] = [];
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  @ViewChild(HistoricTableComponent) tableComponent!: HistoricTableComponent;

  predictionForm = new FormGroup({
    under30: new FormControl('', Validators.required),
    champion: new FormControl('', Validators.required),
    position: new FormControl('', Validators.required),
    skillfulLeg: new FormControl('', Validators.required)
  });

  submitData() {
    if (this.predictionForm.valid) {
      this._dialog.open(LoadingComponent, {
        data: 'Calculando probabilidad y registrado resultado...',
        disableClose: true
      });

      const historic = <HistoricTableItem> this.predictionForm.value;
      this.fillFields(historic);
      this.calculate(historic);

      const docRef = doc(collection(this._firestore, 'historical'));
      setDoc(docRef, historic, { merge: true })
        .then(() => {
          this._snackBar.open('Predicción realizada y registrada.', 'Cerrar');
          this.formDirective.resetForm();
        })
        .catch(() => {
          this._snackBar.open('Error al registrar la predicción.', 'Aceptar');
        })
        .finally(() => {
          this._dialog.closeAll();
        });
    }
  }

  private fillFields = (historic: HistoricTableItem) => {
    historic.number = this.historicalData.length + 1;
    historic.yesOdds = historic.yesOdds || '';
    historic.noOdds = historic.noOdds || '';
  };

  private calculate = (historic: HistoricTableItem) => {
    historic.goodChoice = '';
    const length = this.historicalData.length;
    const yes = this.historicalData
      .filter((item) => item.goodChoice === 'SI');

    const yesUnder30 = yes.filter((item) => item.under30 === historic.under30).length;
    const yesChampion = yes.filter((item) => item.champion === historic.champion).length;
    const yesPosition = yes.filter((item) => item.position === historic.position).length;
    const yesSkillfulLeg = yes.filter((item) => item.skillfulLeg === historic.skillfulLeg).length;

    const yesPEH =
      ((yesUnder30 / yes.length) * (yesChampion / yes.length) * (yesPosition / yes.length) * (yesSkillfulLeg / yes.length))
      *
      (yes.length / length);
    const yesResult = (yes.length / length) * yesPEH;

    const no = this.historicalData
      .filter((item) => item.goodChoice === 'NO');

    const noUnder30 = no.filter((item) => item.under30 === historic.under30).length;
    const noChampion = no.filter((item) => item.champion === historic.champion).length;
    const noPosition = no.filter((item) => item.position === historic.position).length;
    const noSkillfulLeg = no.filter((item) => item.skillfulLeg === historic.skillfulLeg).length;

    const noPEH =
      ((noUnder30 / no.length) * (noChampion / no.length) * (noPosition / no.length) * (noSkillfulLeg / no.length))
      *
      (no.length / length);
    const noResult = (no.length / length) * noPEH;

    historic.yesOdds = (yesResult * 100).toFixed(2);
    historic.noOdds = (noResult * 100).toFixed(2);
    historic.goodChoice = yesResult > noResult ? 'SI' : 'NO';
  };
}
