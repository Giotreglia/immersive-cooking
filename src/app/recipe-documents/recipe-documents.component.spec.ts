import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDocumentsComponent } from './recipe-documents.component';

describe('RecipeDocumentsComponent', () => {
  let component: RecipeDocumentsComponent;
  let fixture: ComponentFixture<RecipeDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
