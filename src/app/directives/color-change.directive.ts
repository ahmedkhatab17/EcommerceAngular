import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appColorChange]'
})
export class ColorChangeDirective {
  @Input() appColorChange: string = 'blue';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.changeColor(this.appColorChange);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeColor('');
  }

  private changeColor(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
