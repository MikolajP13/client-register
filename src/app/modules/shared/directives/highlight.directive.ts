import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  appHighlight = input.required();
  private elementRef = inject(ElementRef);

  constructor() {}

  @HostListener('mouseenter') enter() {
    this.elementRef.nativeElement.style.backgroundColor = this.appHighlight();
    // this.elementRef.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('mouseleave') leave() {
    this.elementRef.nativeElement.style.backgroundColor = '';
  }

  // ngOnInit(): void {
  //   this.elementRef.nativeElement.style.backgroundColor = this.appHighlight();
  // }
}
