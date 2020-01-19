import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public doughnutChartLabelsToxic = ['Toxic', 'Non toxic'];
    public doughnutChartLabelsSevereToxic = ['Severe toxic', 'Non severe toxic'];
    public doughnutChartLabelsObscene = ['Obscene', 'Non obscene'];
    public doughnutChartLabelsThreat = ['Threat', 'Non threat'];
    public doughnutChartLabelsInsult = ['Insult', 'Non insult'];
    public doughnutChartLabelsIdentityHate = ['Identity hate', 'Non identity hate'];

    public doughnutChartDataToxicLSTM = [0, 100];
    public doughnutChartDataSevereToxicLSTM = [0, 100];
    public doughnutChartDataObsceneLSTM = [0, 100];
    public doughnutChartDataThreatLSTM = [0, 100];
    public doughnutChartDataInsultLSTM = [0, 100];
    public doughnutChartDataIdentityHateLSTM = [0, 100];

    public doughnutChartDataToxicBERT = [0, 100];
    public doughnutChartDataSevereToxicBERT = [0, 100];
    public doughnutChartDataObsceneBERT = [0, 100];
    public doughnutChartDataThreatBERT = [0, 100];
    public doughnutChartDataInsultBERT = [0, 100];
    public doughnutChartDataIdentityHateBERT = [0, 100];

    public doughnutChartType = 'doughnut';
    public doughnutChartOptions = {
        responsive: true
    };
    public loading = false;
    public nLoading = 0;

    constructor(private apiService: ApiService) { }

    calculate(comment: string): void {
        this.loading = true;
        this.nLoading++;
        const sub = this.apiService.predictBERT(comment).subscribe((value) => {
            sub.unsubscribe();
            this.doughnutChartDataToxicBERT = [value.toxic, 1 - value.toxic];
            this.doughnutChartDataSevereToxicBERT = [value.severe_toxic, 1 - value.severe_toxic];
            this.doughnutChartDataObsceneBERT = [value.obscene, 1 - value.obscene];
            this.doughnutChartDataThreatBERT = [value.threat, 1 - value.threat];
            this.doughnutChartDataInsultBERT = [value.insult, 1 - value.insult];
            this.doughnutChartDataIdentityHateBERT = [value.identity_hate, 1 - value.identity_hate];
            this.nLoading--;

            if (this.nLoading <= 0) {
                this.nLoading = 0;
                this.loading = false;
            }
        }, (error) => {
            this.nLoading = 0;
            this.loading = false;
            console.log(error.message);
        });

        this.loading = true;
        this.nLoading++;
        const sub2 = this.apiService.predictLSTM(comment).subscribe((value) => {
            sub2.unsubscribe();
            console.log(value);

            this.doughnutChartDataToxicLSTM = [value.toxic, 1 - value.toxic];
            this.doughnutChartDataSevereToxicLSTM = [value.severe_toxic, 1 - value.severe_toxic];
            this.doughnutChartDataObsceneLSTM = [value.obscene, 1 - value.obscene];
            this.doughnutChartDataThreatLSTM = [value.threat, 1 - value.threat];
            this.doughnutChartDataInsultLSTM = [value.insult, 1 - value.insult];
            this.doughnutChartDataIdentityHateLSTM = [value.identity_hate, 1 - value.identity_hate];
            this.nLoading--;

            if (this.nLoading <= 0) {
                this.nLoading = 0;
                this.loading = false;
            }
        }, (error) => {
            this.nLoading = 0;
            this.loading = false;
            console.log(error.message);
        });
    }
}
