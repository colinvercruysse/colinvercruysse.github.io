import { Component, Input, OnInit, Self, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IGame } from 'src/app/data/interfaces';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent implements ControlValueAccessor, OnInit {
  @Input()
  value: IGame | undefined;

  model: any;

  onChange = (value: any) => { };
  onTouched = () => { };

  checked: boolean = false;

  // Add an output property that emits the selected value
  @Output() selectedValueChange = new EventEmitter<IGame>();

  constructor(@Self() private ngControl: NgControl, private gameStateService: GameStateService) {
    ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.ngControl.control!.valueChanges.subscribe(value => {
      // Check to ensure the value wasn't already set (Template driven forms)
      if (this.model === value) return;
      this.writeValue(value);
    });
  }

  writeValue(obj: any): void {
    this.model = obj;

    if (obj === null || obj === undefined) return

    this.gameStateService.setSelectedGame(obj as IGame);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    () => { }
  }

  select() {
    this.model = this.model === this.value ? null : this.value;
    this.onChange(this.model);
  }
}
