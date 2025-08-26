import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appMyStyle]'
})
export class MyStyleDirective implements OnChanges {

  @Input() myStyle: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['myStyle'] && this.myStyle) {
      this.el.nativeElement.style.background = this.myStyle;
    }
  }
}
