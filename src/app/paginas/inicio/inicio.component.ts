import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuComponent } from "../../layout/menu/menu.component";
import { HeroComponent } from "../../layout/hero/hero.component";
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { CommonModule } from '@angular/common';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

declare var UIkit: any;

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MenuComponent, CommonModule, RodapeComponent, HeroComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      naturalidade: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      residencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      indicador: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      idade: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      numeroBI: ['', [Validators.required, Validators.pattern(/^\d{9}[A-Z]{2}\d{3}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telWhatsapp: ['', [Validators.required, Validators.pattern(/^(244)?9\d{8}$/)]],
      ocupacao: ['', Validators.required],
      areasInteresse: this.fb.array([], Validators.required), // <== AQUI
      motivacao: ['', [Validators.required, Validators.minLength(30)]],
      afiliadoPartido: [''],
      partidoQual: [''],
      profissaoValor: ['', [Validators.required, Validators.minLength(3)]],
      nivelAcademico: ['', Validators.required],
      areaFormacao: ['', Validators.required],
      ideologia: ['', Validators.required],
      entidadeCastrense: [''],
      castrenseQual: [''],
      linkedin: [''],
      instagram: [''],
      facebook: [''],
      aceite: [false, Validators.requiredTrue],
      principios: [false, Validators.requiredTrue],
    });
  }

  get areasInteresse(): FormArray {
    return this.registerForm.get('areasInteresse') as FormArray;
  }

  toggleArea(value: string) {
    const index = this.areasInteresse.value.indexOf(value);
    if (index >= 0) {
      this.areasInteresse.removeAt(index);
    } else {
      this.areasInteresse.push(this.fb.control(value));
    }
  }

  async submitForm(event?: Event) {
    if (event) {
      console.log('Evento de submit recebido:', event);
      event.preventDefault(); // evita comportamento padrão
    }

    console.log('FormGroup atual:', this.registerForm.value);
    this.registerForm.markAllAsTouched();

    // Checa validade do formulário
    if (this.registerForm.invalid) {
      console.warn('Formulário inválido!', this.registerForm.errors);
      this.registerForm.markAllAsTouched();
      UIkit.modal('#validation-modal').show();
      return;
    }

    this.isSubmitting = true;
    console.log('Formulário válido, iniciando envio...');
    UIkit.modal('#loading-modal').show();

    // Prepare dados para EmailJS
    const formData = {
      ...this.registerForm.value,
      areasInteresse: this.areasInteresse.value.join(', ')
    };

    console.log('Dados preparados para envio:', formData);

    try {
      const response: EmailJSResponseStatus = await emailjs.send(
        'service_cnu8v36',
        'template_e3bil8d',
        formData,
        { publicKey: 'WePaql4pWU06LBwpO' }
      );

      console.log('EmailJS resposta:', response);
      UIkit.modal('#loading-modal').hide();
      UIkit.modal('#success-modal').show();

      // Resetar form
     this.resetForm();

      console.log('Formulário resetado.');
    } catch (error: any) {
      console.error('Falha ao enviar EmailJS:', error);
      UIkit.modal('#loading-modal').hide();
      UIkit.modal('#error-modal').show();
    } finally {
      this.isSubmitting = false;
      console.log('Envio finalizado, isSubmitting:', this.isSubmitting);
    }
  }

  resetForm() {
  this.registerForm.reset();
  this.areasInteresse.clear();

  // 🔄 Força reset visual dos botões
  const buttons = document.querySelectorAll('.glass-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
}
}
