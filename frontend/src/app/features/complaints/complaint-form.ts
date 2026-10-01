import { Component, effect, inject, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Complaint, ComplaintCategory, ComplaintPriority } from './complaint.model';
import { ComplaintService } from './complaint.service';

@Component({
  selector: 'app-complaint-form',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    MessageModule,
  ],
  templateUrl: './complaint-form.html',
  styleUrl: './complaint-form.css',
})
export class ComplaintForm {
  readonly visible = model(false);
  readonly created = output<Complaint>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly complaintService = inject(ComplaintService);
  private readonly messageService = inject(MessageService);

  saving = false;

  readonly categories: ComplaintCategory[] = [
    'Transport',
    'Utilities',
    'Environment',
    'Public Services',
    'Infrastructure',
    'Other',
  ];

  readonly priorities: ComplaintPriority[] = ['Low', 'Medium', 'High'];

  readonly form = this.formBuilder.group({
    title: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(120),
    ]),
    description: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(2000),
    ]),
    category: this.formBuilder.control<ComplaintCategory | null>(null, Validators.required),
    priority: this.formBuilder.control<ComplaintPriority | null>(null, Validators.required),
    createdAt: this.formBuilder.control<Date | null>(new Date(), Validators.required),
  });

  private formSubmitted = false;

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.form.reset({
          title: '',
          description: '',
          category: null,
          priority: null,
          createdAt: new Date(),
        });
        this.formSubmitted = false;
      }
    });
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.formSubmitted);
  }

  errorMessage(controlName: keyof typeof this.form.controls): string | null {
    if (!this.isInvalid(controlName)) {
      return null;
    }

    const control = this.form.controls[controlName];
    const label = fieldLabels[controlName];

    if (control.hasError('required')) {
      return `${label} is required.`;
    }

    if (control.hasError('maxlength')) {
      return `${label} is too long.`;
    }

    return null;
  }

  save(): void {
    this.formSubmitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, category, priority, createdAt } = this.form.getRawValue();
    if (!category || !priority || !createdAt || this.saving) {
      return;
    }

    this.saving = true;
    this.complaintService
      .create({
        title,
        description,
        category,
        priority,
        createdAt,
      })
      .subscribe({
        next: (complaint) => {
          this.saving = false;
          this.visible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Complaint created',
            detail: complaint.title,
            life: 4000,
          });
          this.created.emit(complaint);
        },
        error: () => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Complaint was not saved',
            detail: 'The server could not save this complaint. Nothing was added to the list.',
            life: 6000,
          });
        },
      });
  }

  cancel(): void {
    this.visible.set(false);
  }
}

const fieldLabels = {
  title: 'Subject',
  description: 'Description',
  category: 'Category',
  priority: 'Priority',
  createdAt: 'Date',
} as const;
