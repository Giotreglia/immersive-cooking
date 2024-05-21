import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExecutionComponent } from './show-execution.component';

describe('ShowExecutionComponent', () => {
  let component: ShowExecutionComponent;
  let fixture: ComponentFixture<ShowExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowExecutionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
